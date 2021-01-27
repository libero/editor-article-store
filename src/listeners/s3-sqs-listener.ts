import { default as path } from 'path';
import { default as fs } from 'fs';
import { Consumer } from "sqs-consumer";
import AWS from "aws-sdk";
import { configManager } from "../services/config-manager";
import initialiseDb from "../db";

import {
  createConfigFromArgs,
  createConfigFromEnv,
} from "../utils/config-utils";
import { defaultConfig } from "../config/default";
import importHandler from './import-handler';
import { buildDatabaseUri } from '../utils/db-utils';

// Load the configuration for this service with the following precedence...
//   process args > environment vars > config file.
configManager.apply(defaultConfig);
configManager.apply(createConfigFromEnv(process.env));
configManager.apply(createConfigFromArgs(process.argv));

AWS.config.update({
  region: configManager.get("awsRegion"),
  accessKeyId: configManager.get("awsAccessKey"),
  secretAccessKey: configManager.get("awsSecretAccessKey"),
});

const s3 = new AWS.S3({
  endpoint: configManager.get("awsEndpoint"),
  apiVersion: "2006-03-01",
  s3ForcePathStyle: true,
});

function parseMessage(message: AWS.SQS.Message): { key: string, bucketName: string }[] {
  try {
    const messageBody = JSON.parse(message.Body || "");
    return messageBody.Records.map((record: any) => ({ key: record.s3.object.key, bucketName: record.s3.bucket.name}));  
  } catch {
    throw new Error('Unable to parse message:' + message);
  }
}

export default async function start() {
  console.log('Starting import listener...');

  // Database Name
  const dbName = configManager.get("dbName");

  // Connection URI
  const dbUri = buildDatabaseUri(configManager.get("dbEndpoint"), configManager.get("dbUser"), configManager.get("dbPassword"), configManager.get("dbUriQuery"))

  // Target bucket
  const editorBucket = configManager.get("editorS3Bucket");

  // connect to cluster with TSL enabled 
  const dbSSLValidate = configManager.get("dbSSLValidate");
  const dbCertLocation = "/rds-combined-ca-bundle.pem";

  let dbSSLCert: (string | Buffer)[] | undefined;
  if(dbSSLValidate) {
    dbSSLCert = [fs.readFileSync(dbCertLocation)]
  }
  const db = await initialiseDb(dbUri, dbName, dbSSLCert);

  const handler = importHandler(s3, db, editorBucket);

  const S3SQSListener = Consumer.create({
    queueUrl: configManager.get("awsBucketInputEventQueueUrl"),
    region: configManager.get("awsRegion"),
    batchSize: 1,
    handleMessage: async (message) => {
      // Throw in here to leave message on queue
      const keyBucketList = parseMessage(message);
      for(const keyBucketItem of keyBucketList) {
        console.log(
          `SQS - S3 upload event received - { Key: ${keyBucketItem.key}, Bucket: ${keyBucketItem.bucketName} }`
        );
        await handler.import(keyBucketItem.key, keyBucketItem.bucketName);
      }
    },
    sqs: new AWS.SQS({
      endpoint: configManager.get("awsEndpoint"),
    })
  });

  S3SQSListener.on("message_processed", async function(message) {
    const keyBucketList = parseMessage(message);
    keyBucketList.forEach(async (record: any) => {
      console.log(
        `SQS - S3 upload event successfully consumed - { Key: ${record.key}, Bucket: ${record.bucketName} }`
      );
    });
  }).on("processing_error", function(err) {
    console.log('SQS - Error processing message - ', err.message);
  }).on("error", function(err) {
    console.log('SQS - Error interacting with queue - ', err);
  });

  S3SQSListener.start();
}
