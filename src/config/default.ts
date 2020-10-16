import { Config } from "../types/config";

// An initial default config
export const defaultConfig: Config = {
  articleRoot: "./resources/articles",
  port: 8080,
  awsSqsRegion: "eu-west-1",
  awsSqsAccessKey: "key",
  awsSqsSecretAccessKey: "secret",
  awsBucketInputEventQueueUrl:
    "http://localhost:4566/000000000000/KryiaUploadQueue",
  awsEndPoint: "http://localhost:4566",
  mongoUrl: "mongodb://root:password@localhost:27017",
  mongoDbName: "editor",
  editorS3Bucket: "editor",
};
