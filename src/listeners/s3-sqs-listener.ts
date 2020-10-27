import { Consumer } from "sqs-consumer";
import AWS from "aws-sdk";
import { configManager } from "../services/config-manager";
import { MongoClient } from "mongodb";

import {
  createConfigFromArgs,
  createConfigFromEnv,
} from "../utils/config-utils";
import { defaultConfig } from "../config/default";
import importHandler from './import-handler';

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


export default async function start() {
  // Connection URL
  const url = configManager.get("mongoUrl");
  // Target bucket
  const editorBucket = configManager.get("editorS3Bucket");
  // Database Name
  const dbName = configManager.get("mongoDbName");
  const client = await MongoClient.connect(url);
  const db = client.db(dbName);

  const handler = importHandler(s3, db, editorBucket);

  const S3SQSListener = Consumer.create({
    queueUrl: configManager.get("awsBucketInputEventQueueUrl"),
    region: configManager.get("awsSqsRegion"),
    batchSize: 1,
    handleMessage: async (message) => {
      /* istanbul ignore next */
      const messageBody = JSON.parse(message.Body || "");
      /* istanbul ignore next */
      messageBody?.Records?.forEach((record: any) => {
        console.log(
          `SQS - AWS S3 uploaded event been consumed - { Key: ${record.s3.object.key}, Bucket: ${record.s3.bucket.name} }`
        );
      });
    },
    sqs: new AWS.SQS({
      endpoint: configManager.get("awsEndPoint"),
    })
  });
  S3SQSListener.on("message_received", async function(message) {
    const messageBody = JSON.parse(message.Body);
    if (messageBody?.Records?.length) {
      messageBody.Records.forEach(async (record: any) => {
        console.log(
          `SQS - AWS S3 uploaded event been consumed - { Key: ${record.s3.object.key}, Bucket: ${record.s3.bucket.name} }`
        );
        try {
          await handler.import(record.s3.object.key, record.s3.bucket.name);
        } catch(error) {
          S3SQSListener.emit('error', error);
        }
      });
    }
  }).on("error", function(err) {
    console.log(err);
  });

  S3SQSListener.start();
}
