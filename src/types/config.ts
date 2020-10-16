export type Config = {
  articleRoot?: string;
  port?: number;
  awsSqsRegion?: string;
  awsSqsAccessKey?: string;
  awsSqsSecretAccessKey?: string;
  awsBucketInputEventQueueUrl?: string;
  awsEndPoint?: string;
  mongoUrl?: string;
  mongoDbName?: string;
  editorS3Bucket?: string;
};
