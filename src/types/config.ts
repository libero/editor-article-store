export type Config = {
  port?: number;
  awsRegion?: string;
  awsAccessKey?: string;
  awsSecretAccessKey?: string;
  awsBucketInputEventQueueUrl?: string;
  awsEndpoint?: string;
  dbEndpoint?: string;
  dbUriQuery?: string;
  dbUser?: string;
  dbPassword?: string;
  dbSSLValidate?: boolean;
  dbName?: string;
  editorS3Bucket?: string;
  srcS3Bucket?: string;
};
