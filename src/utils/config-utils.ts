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
    if (env['DB_ENDPOINT']) {
        retVal.dbEndpoint = env['DB_ENDPOINT'];
    }
    if (env['DB_URI_QUERY']) {
        retVal.dbUriQuery = env['DB_URI_QUERY'];
    }
    if (env['DB_USER']) {
        retVal.dbUser = env['DB_USER'];
    }
    if (env['DB_PASSWORD']) {
        retVal.dbPassword = env['DB_PASSWORD'];
    }
    if (env['DB_SSL_VALIDATE']) {
        retVal.dbSSLValidate = env['DB_SSL_VALIDATE'] === 'true';
    }
    if (env['DB_NAME']) {
        retVal.dbName = env['DB_NAME'];
    }
    if (env['AWS_REGION']) {
        retVal.awsRegion = env['AWS_REGION'];
    }
    if (env['AWS_ACCESS_KEY']) {
        retVal.awsAccessKey = env['AWS_ACCESS_KEY'];
    }
    if (env['AWS_SECRET_ACCESS_KEY']) {
        retVal.awsSecretAccessKey = env['AWS_SECRET_ACCESS_KEY'];
    }
    if (env['AWS_BUCKET_INPUT_EVENT_QUEUE_URL']) {
        retVal.awsBucketInputEventQueueUrl = env['AWS_BUCKET_INPUT_EVENT_QUEUE_URL'];
    }
    if (env['AWS_ENDPOINT']) {
        retVal.awsEndpoint = env['AWS_ENDPOINT'];
    }
    if (env['AWS_SRC_BUCKET']) {
        retVal.srcS3Bucket = env['SRC_BUCKET'];
    }
    if (env['AWS_EDITOR_BUCKET']) {
        retVal.editorS3Bucket = env['AWS_EDITOR_BUCKET'];
    }
    if (env['IMPORT_TRANSFORM_ENABLED']) {
        retVal.importTransformEnabled = env['IMPORT_TRANSFORM_ENABLED'] === 'true';
    }
    if (env['IMPORT_TRANSFORM_URL']) {
        retVal.importTransformUrl = env['IMPORT_TRANSFORM_URL'];
    }
    if (env['EXPORT_TRANSFORM_ENABLED']) {
        retVal.exportTransformEnabled = env['EXPORT_TRANSFORM_ENABLED'] === 'true';
    }
    if (env['EXPORT_TRANSFORM_URL']) {
        retVal.exportTransformUrl = env['EXPORT_TRANSFORM_URL'];
    }
    return retVal;
}
