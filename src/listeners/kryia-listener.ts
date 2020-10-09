import { Consumer } from "sqs-consumer";
import AWS from "aws-sdk";

AWS.config.update({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const sqsApp = Consumer.create({
  queueUrl: process.env.SQS_QUEUE_URL,
  region: process.env.AWS_REGION,
  batchSize: 1,
  sqs: new AWS.SQS({
    endpoint: process.env.AWS_END_POINT,
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
