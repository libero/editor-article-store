import { Config } from "../types/config";

// An initial default config
export const defaultConfig: Config = {
  port: 8080,
  awsRegion: "eu-west-1",
  awsAccessKey: "key",
  awsSecretAccessKey: "secret",
  awsBucketInputEventQueueUrl: "http://localhost:4566/000000000000/KryiaUploadQueue",
  awsEndPoint: "http://localhost:4566",
  mongoUrl: "mongodb://root:password@mongo:27017",
  mongoDbName: "editor",
  editorS3Bucket: "editor",
  srcS3Bucket: "kryia"
};
