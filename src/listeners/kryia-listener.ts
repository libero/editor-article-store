import { Consumer } from "sqs-consumer";
import AWS from "aws-sdk";
import { configManager } from '../services/config-manager';
import { createConfigFromArgs, createConfigFromEnv } from '../utils/config-utils';
import { defaultConfig } from '../config/default';
import unzipper from 'unzipper';

// Load the configuration for this service with the following precedence...
//   process args > environment vars > config file.
configManager.apply(defaultConfig);
configManager.apply(createConfigFromEnv(process.env));
configManager.apply(createConfigFromArgs(process.argv));

AWS.config.update({
  region: configManager.get('awsSqsRegion'),
  accessKeyId: configManager.get('awsSqsAccessKey'),
  secretAccessKey: configManager.get('awsSqsSecretAccessKey'),
});

const s3 = new AWS.S3({
  endpoint: configManager.get('awsEndPoint'),
  apiVersion: '2006-03-01',
  s3ForcePathStyle: true 
});

const sqsApp = Consumer.create({
  queueUrl: configManager.get('sqsKryiaQueueUrl'),
  region: configManager.get('awsSqsRegion'),
  batchSize: 1,
  sqs: new AWS.SQS({
    endpoint: configManager.get('awsEndPoint')
  }),
  handleMessage: async (message) => {
    const id = message.Body;
    console.log("SQS - AWS S3 uploaded event been consumed, body id: ", id);
  },
});
sqsApp
  .on("error", function(err) {
    console.log(err);
  })
  .on("message_received", function(message) {
    const messageBody = JSON.parse(message.Body);
    if(messageBody && messageBody.Records.length) {
      messageBody.Records.forEach(async (record: any) => {
        try {
          const directory = await unzipper.Open.s3(s3,{ Key: record.s3.object.key, Bucket: record.s3.bucket.name });
          const file = directory.files.find((d: any) => d.path.includes('.xml'));
          if (file){
            const content = await file.buffer();
            console.log(content.toString());
          }
        } catch(error) {
          console.log("Error when fetching and opening zip: ", error);
        }
      });
    }
  });

export default sqsApp;