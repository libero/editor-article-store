import { default as cors } from "cors";
import { default as express } from "express";
import { articlesRouter } from "./routers/articles.js";
import { changesRouter } from "./routers/changes.js";
import { http404Response } from "./providers/errors.js";

import { Consumer } from "sqs-consumer";
import AWS from "aws-sdk";

export const app: express.Application = express();

// Register middlewares
app.use(cors());

// Register routers
app.use("/articles", articlesRouter);
app.use("/articles/:articleId/changes", changesRouter);

// Register 'catch all' handler
app.all("*", http404Response);

// throw away code.
const sqsApp = Consumer.create({
  queueUrl: "http://localhost:4566/000000000000/KryiaUploadQueue",
  // region: process.env.REGION,
  batchSize: 1,
  sqs: new AWS.SQS({
    endpoint:'http://localhost:4566'
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
