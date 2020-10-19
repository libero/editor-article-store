import { Consumer } from "sqs-consumer";
import AWS from "aws-sdk";
import { configManager } from "../services/config-manager";
import {
  createConfigFromArgs,
  createConfigFromEnv,
} from "../utils/config-utils";
import { defaultConfig } from "../config/default";
import unzipper from "unzipper";
import { Db, MongoClient } from "mongodb";
import FileType from "file-type";
import { Article } from "../types/article";
import { UpdateFunctionDefinitionRequest } from "aws-sdk/clients/greengrass";

// Load the configuration for this service with the following precedence...
//   process args > environment vars > config file.
configManager.apply(defaultConfig);
configManager.apply(createConfigFromEnv(process.env));
configManager.apply(createConfigFromArgs(process.argv));

AWS.config.update({
  region: configManager.get("awsSqsRegion"),
  accessKeyId: configManager.get("awsSqsAccessKey"),
  secretAccessKey: configManager.get("awsSqsSecretAccessKey"),
});

const s3 = new AWS.S3({
  endpoint: configManager.get("awsEndPoint"),
  apiVersion: "2006-03-01",
  s3ForcePathStyle: true,
});

type FileParts = {
  version: string;
  articleId: string;
};

// S3 has the following format /folder/zip-id-version.zip
const extractS3Path = (s3Key: string): FileParts => {
  const s3Paths = s3Key.split("/");
  const fileNameParts = s3Paths[s3Paths.length - 1].split("-");
  const articleId = fileNameParts[1];
  const version = fileNameParts[fileNameParts.length - 1].replace(".zip", "");
  return {
    articleId,
    version,
  };
};

const getFilenameFromPath = (filePath: string) => {
  const filePaths = filePath.split("/");
  return filePaths[filePaths.length - 1]
}

const writeArticleToDb = async (db: Db, article: Article) => {
  await db.collection("articles").insertOne({
    ...article,
  });
};

export default async function start() {
  // Connection URL
  const url = configManager.get("mongoUrl");

  // Database Name
  const dbName = configManager.get("mongoDbName");
  const editorBucket = configManager.get("editorS3Bucket");
  const client = await MongoClient.connect(url);
  const db = client.db(dbName);
  const S3SQSListener = Consumer.create({
    queueUrl: configManager.get("awsBucketInputEventQueueUrl"),
    region: configManager.get("awsSqsRegion"),
    batchSize: 1,
    sqs: new AWS.SQS({
      endpoint: configManager.get("awsEndPoint"),
    }),
    handleMessage: async (message) => {
      const messageBody = JSON.parse(message.Body || '');
      if (messageBody.Records?.length) {
        messageBody.Records.forEach((record: any) => {
          console.log(`SQS - AWS S3 uploaded event been consumed - { Key: ${record.s3.object.key}, Bucket: ${record.s3.bucket.name} }`);
        });
      }
    },
  });
  S3SQSListener.on("error", function(err) {
    console.log(err);
  }).on("message_received", async function(message) {
    const messageBody = JSON.parse(message.Body);
    if (messageBody && messageBody.Records.length) {
      messageBody.Records.forEach(async (record: any) => {
        let zipContentsDirectory;
        let articleToStore: Article | undefined;
        const { articleId, version } = extractS3Path(
          record.s3.object.key
        );
        try {
          zipContentsDirectory = await unzipper.Open.s3(s3, {
            Key: record.s3.object.key,
            Bucket: record.s3.bucket.name,
          });
        } catch (error) {
          throw new Error(`Error when fetching and unzipping object: { Key: ${record.s3.object.key}, Bucket: ${record.s3.bucket.name} } - ${error}`);
        }
        for (const file of zipContentsDirectory.files) {
          if (file) {
            const fileName = getFilenameFromPath(file.path);
            const content = await file.buffer();
            const contentType = await FileType.fromBuffer(content);
            const params = {
              Body: content,
              Bucket: editorBucket,
              Key: `${articleId}/${fileName}`,
              ACL: "private",
              ContentType: contentType?.mime,
            };
            try {
              await s3.putObject(params).promise();
              console.log(`Object stored: { Key: ${articleId}/${fileName}, Bucket: ${editorBucket} }`);
            } catch(error) {
              throw new Error(`Error when storing object: { Key: ${articleId}/${fileName}, Bucket: ${editorBucket} } - ${error}`);
            }

            if (file.path.includes(".xml")) {
              articleToStore = {
                xml: content.toString(),
                articleId,
                version,
                datatype: "xml",
                fileName,
              };
            }
          }
        }

        if (!articleToStore) {
          throw new Error(`Error finding article XML file in object: { Key: ${record.s3.object.key}, Bucket: ${record.s3.bucket.name} }`);
        }

        try {
          await writeArticleToDb(db, articleToStore);
          console.log(`Article XML stored: { ArticleID: ${articleId}, Version: ${version} }`);
        } catch (error) {
          throw new Error(`Error storing article XML: { ArticleID: ${articleId}, Version: ${version} }` + error);
        }
      });
    }
  });

  S3SQSListener.start();
}
