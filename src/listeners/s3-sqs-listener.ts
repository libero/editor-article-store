import { default as fs } from 'fs';
import { Consumer } from "sqs-consumer";
import AWS from "aws-sdk";
import { configManager } from "../services/config-manager";
import AssetService from '../services/asset';
import initialiseDb from "../db";
import {
  createConfigFromArgs,
  createConfigFromEnv,
} from "../utils/config-utils";
import { defaultConfig } from "../config/default";
import importHandler from './import-handler';
import { parseMessage, handleMessage } from './message-handler';
import { buildDatabaseUri } from '../utils/db-utils';
import AssetRepository from "../repositories/assets";

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

async function buildHandler() {
 // Database Name
 const dbName = configManager.get("dbName");

 // Connection URI
 const dbUri = buildDatabaseUri(configManager.get("dbEndpoint"), configManager.get("dbUser"), configManager.get("dbPassword"), configManager.get("dbUriQuery"))

 // connect to cluster with TSL enabled 
 const dbSSLValidate = configManager.get("dbSSLValidate");
 const dbCertLocation = "/rds-combined-ca-bundle.pem";

 let dbSSLCert: (string | Buffer)[] | undefined;
 if(dbSSLValidate) {
   dbSSLCert = [fs.readFileSync(dbCertLocation)]
 }
 const db = await initialiseDb(dbUri, dbName, dbSSLCert);
 const assetRepository = await AssetRepository(db);
 const assetService = AssetService(s3, assetRepository, configManager);

 return importHandler(assetService, db);
}

export default async function start() {
  console.log('Starting import listener...');

  const handler = await buildHandler();
  const S3SQSListener = Consumer.create({
    queueUrl: configManager.get("awsBucketInputEventQueueUrl"),
    region: configManager.get("awsRegion"),
    batchSize: 1,
    handleMessage: async (message) => {
      // Throw in here to leave message on queue
      await handleMessage(handler.import, message)
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
