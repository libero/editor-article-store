import { createConfigFromArgs, createConfigFromEnv } from '../../../src/utils/config-utils';

describe('createConfigFromArgs()', () => {
 test('Support short form args', () => {
    const input = ['-p', '8080'];
    const output = {
      port: 8080
    };
    expect(createConfigFromArgs(input)).toEqual(output);
  });

  test('Cope with empty input', () => {
    const input = [''];
    const output = {};
    expect(createConfigFromArgs(input)).toEqual(output);
  });

  test('Cope with missing value(s)', () => {
    const input = ['-p'];
    const output = {};
    expect(createConfigFromArgs(input)).toEqual(output);
  });

  test('Cope with missing value(s)', () => {
    const input = ['-p'];
    const output = {};
    expect(createConfigFromArgs(input)).toEqual(output);
  });

  test('Cope with unsupported args', () => {
    const input = ['none', 'of', 'these', 'matter'];
    const output = {};
    expect(createConfigFromArgs(input)).toEqual(output);
  });

  test('Cope with all supported args', () => {
    const input = ['-p', '8080'];
    const output = {
      port: 8080
    };
    expect(createConfigFromArgs(input)).toEqual(output);
  });
});

describe('createConfigFromEnv()', () => {
  test('Cope with empty input', () => {
    const input = {};
    const output = {};
    expect(createConfigFromEnv(input)).toEqual(output);
  });

  test('Cope with full input', () => {
    const input = {
      PORT: '8080',
      DB_ENDPOINT: 'mongo',
      DB_USER: 'root',
      DB_PASSWORD: 'password',
      DB_URI_QUERY: 'foo=bar',
      DB_SSL_VALIDATE: 'true',
      DB_NAME: 'dbname',
      AWS_REGION: 'AWS_REGION',
      AWS_ACCESS_KEY: 'AWS_ACCESS_KEY',
      AWS_SECRET_ACCESS_KEY: 'AWS_SECRET_ACCESS_KEY',
      AWS_BUCKET_INPUT_EVENT_QUEUE_URL: 'AWS_BUCKET_INPUT_EVENT_QUEUE_URL',
      AWS_ENDPOINT: 'AWS_ENDPOINT',
      IMPORT_TRANSFORM_ENABLED: 'true',
      IMPORT_TRANSFORM_URL: 'someUrl'
    };
    const output = {
      port: 8080,
      dbEndpoint: 'mongo',
      dbUser: 'root',
      dbPassword: 'password',
      dbUriQuery: 'foo=bar',
      dbName: 'dbname',
      dbSSLValidate: true,
      awsRegion: 'AWS_REGION',
      awsAccessKey: 'AWS_ACCESS_KEY',
      awsSecretAccessKey: 'AWS_SECRET_ACCESS_KEY',
      awsBucketInputEventQueueUrl: 'AWS_BUCKET_INPUT_EVENT_QUEUE_URL',
      awsEndpoint: 'AWS_ENDPOINT',
      importTransformEnabled: true,
      importTransformUrl: 'someUrl'
    };
    expect(createConfigFromEnv(input)).toEqual(output);
  });

  test('Cope with unsupported args', () => {
    const input = {
      INVALID_ARG: 'invalid'
    };
    const output = {};
    expect(createConfigFromEnv(input)).toEqual(output);
  });

  test('Cope with all supported args', () => {
    const input = {
      PORT: '8080'
    };
    const output = {
      port: 8080
    };
    expect(createConfigFromEnv(input)).toEqual(output);
  });
});
