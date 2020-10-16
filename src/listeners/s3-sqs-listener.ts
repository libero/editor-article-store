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
  fileName: string;
};

// S3 has the following format /folder/zip-id-version.zip
const extractFileParts = (s3Key: string, filePath: string): FileParts => {
  const filePaths = filePath.split("/");
  const s3Paths = s3Key.split("/");
  const fileNameParts = s3Paths[s3Paths.length - 1].split("-");
  const articleId = fileNameParts[1];
  const version = fileNameParts[fileNameParts.length - 1].replace(".zip", "");

  return {
    articleId,
    version,
    fileName: filePaths[filePaths.length - 1],
  };
};

const writeArticleToDb = async (db: Db, article: Article) => {
  await db.collection("articles").insertOne({
    ...article,
  });
};

const S3SQSListener = Consumer.create({
  queueUrl: configManager.get("awsBucketInputEventQueueUrl"),
  region: configManager.get("awsSqsRegion"),
  batchSize: 1,
  sqs: new AWS.SQS({
    endpoint: configManager.get("awsEndPoint"),
  }),
  handleMessage: async (message) => {
    const id = message.Body;
    console.log("SQS - AWS S3 uploaded event been consumed, body id: ", id);
  },
});
S3SQSListener.on("error", function(err) {
  console.log(err);
}).on("message_received", async function(message) {
  // Connection URL
  const url = configManager.get("mongoUrl");

  // Database Name
  const dbName = configManager.get("mongoDbName");
  const editorBucket = configManager.get("editorS3Bucket");
  const client = await MongoClient.connect(url);
  const db = client.db(dbName);
  const messageBody = JSON.parse(message.Body);
  if (messageBody && messageBody.Records.length) {
    messageBody.Records.forEach(async (record: any) => {
      try {
        const directory = await unzipper.Open.s3(s3, {
          Key: record.s3.object.key,
          Bucket: record.s3.bucket.name,
        });
        for await (const file of directory.files) {
          if (file) {
            const { articleId, version, fileName } = extractFileParts(
              record.s3.object.key,
              file.path
            );
            const content = await file.buffer();
            const contentType = await FileType.fromBuffer(content);
            const params = {
              Body: content,
              Bucket: editorBucket,
              Key: `${articleId}/${fileName}`,
              ACL: "private",
              ContentType: contentType?.mime,
            };

            await s3.putObject(params).promise();

            if (file.path.includes(".xml")) {
              const article: Article = {
                xml: content.toString(),
                articleId,
                version,
                datatype: "xml",
                fileName,
              };
              await writeArticleToDb(db, article);
            }
          }
        }
      } catch (error) {
        console.log("Error when fetching and opening zip: ", error);
      }
    });
  }
});

export default S3SQSListener;
