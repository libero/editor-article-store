export type Config = {
  port?: number;
  awsRegion?: string;
  awsAccessKey?: string;
  awsSecretAccessKey?: string;
  awsBucketInputEventQueueUrl?: string;
  awsEndPoint?: string;
  dbUrl?: string;
  dbSSLValidate?: boolean;
  dbName?: string;
  editorS3Bucket?: string;
  srcS3Bucket?: string;
};
