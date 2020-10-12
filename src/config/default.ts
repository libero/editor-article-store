import { Config } from '../types/config';

// An initial default config
export const defaultConfig: Config = {
  articleRoot: './resources/articles',
  port: 8080,
  awsSqsRegion: process.env.AWS_REGION, 
  awsSqsAccessKey: process.env.AWS_ACCESS_KEY,
  awsSqsSecretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  sqsQueueUrl: process.env.SQS_QUEUE_URL,
  awsRegion: process.env.AWS_END_POINT,
};
