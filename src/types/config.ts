export type Config = {
  port?: number;
  awsRegion?: string;
  awsAccessKey?: string;
  awsSecretAccessKey?: string;
  awsBucketInputEventQueueUrl?: string;
  awsEndPoint?: string;
  mongoUrl?: string;
  mongoDbName?: string;
  editorS3Bucket?: string;
  srcS3Bucket?: string;
};
