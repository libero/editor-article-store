import { Consumer } from "sqs-consumer";
import AWS from "aws-sdk";
import { configManager } from '../services/config-manager';
import { createConfigFromArgs, createConfigFromEnv } from '../utils/config-utils';
import { defaultConfig } from '../config/default';

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

const sqsApp = Consumer.create({
  queueUrl: configManager.get('sqsQueueUrl'),
  region: configManager.get('awsSqsRegion'),
  batchSize: 1,
  sqs: new AWS.SQS({
    endpoint: configManager.get('awsRegion')
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
    console.log(message);
  });

sqsApp.start();
