import { Config } from '../types/config';
import { ProcessEnv } from '../types/node';

// Creates a new Config by processing the process' arguments.
export function createConfigFromArgs(args: string[]): Config {
  const retVal: Config = {};
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--port' || args[i] === '-p') {
      if (++i < args.length) {
        retVal.port = parseInt(args[i]);
      }
    }
  }
  return retVal;
}

// Creates a new Config from the process' enviroment vars.
export function createConfigFromEnv(env: ProcessEnv): Config {
  const retVal: Config = {};
  if (env['PORT']) {
    retVal.port = parseInt(env['PORT']);
  }
  if (env['MONGO_URL']) {
    retVal.mongoUrl = env['MONGO_URL'];
  }
  if (env['MONGO_DB_NAME']) {
    retVal.mongoDbName = env['MONGO_DB_NAME'];
  }
  if (env['AWS_REGION']) {
    retVal.awsSqsRegion = env['AWS_REGION'];
  }
  if (env['AWS_ACCESS_KEY']) {
    retVal.awsSqsAccessKey = env['AWS_ACCESS_KEY']; 
  }
  if (env['AWS_SECRET_ACCESS_KEY']) {
    retVal.awsSqsSecretAccessKey = env['AWS_SECRET_ACCESS_KEY'];
  }
  if (env['AWS_SECRET_ACCESS_KEY']) {
    retVal.awsSqsSecretAccessKey = env['AWS_SECRET_ACCESS_KEY']
  }
  if (env['AWS_BUCKET_INPUT_EVENT_QUEUE_URL']) {
    retVal.awsBucketInputEventQueueUrl = env['AWS_BUCKET_INPUT_EVENT_QUEUE_URL'];
  }
  if (env['AWS_END_POINT']) {
    retVal.awsEndPoint = env['AWS_END_POINT'];
  }

  return retVal;
}
