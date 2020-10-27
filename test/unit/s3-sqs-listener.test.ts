import { EventEmitter } from 'events';
const flushPromise = () => new Promise(resolve => setImmediate(resolve));
class mockSqsEventEmmitter extends  EventEmitter {
  start(){}
}

const eventEmmitter = new mockSqsEventEmmitter();
jest.mock('sqs-consumer', () => ({
  Consumer: {
    create: () => eventEmmitter,
  }
}));

jest.mock('mongodb', () => ({
  MongoClient: {
    connect: () => Promise.resolve({
      db: jest.fn()
    })
  }
}));

jest.mock('aws-sdk', ()=> ({
  config: {
    update: jest.fn()
  },
  S3: jest.fn(),
  SQS: jest.fn()
}));

const importMock = jest.fn();
const handlerMock = jest.fn().mockImplementation(() => ({ import: importMock }));
jest.mock('../../src/listeners/import-handler', () => handlerMock)

const getMockSQSMessage = (articleId = '54296') =>  ({ Records: [
  {
    "eventVersion": "2.0", 
    "eventSource": "aws:s3", 
    "awsRegion": "us-east-1", 
    "eventTime": "2020-10-23T11:14:06.036Z", 
    "eventName": "ObjectCreated:Put", 
    "userIdentity": {"principalId": "AIDAJDPLRKLG7UEXAMPLE"}, 
    "requestParameters": {"sourceIPAddress": "127.0.0.1"}, 
    "responseElements": {"x-amz-request-id": "b9c49524", "x-amz-id-2": "eftixk72aD6Ap51TnqcoF8eFidJG9Z/2"}, 
    "s3": {
      "s3SchemaVersion": "1.0", 
      "configurationId": "testConfigRule", 
      "bucket": {"name": "kryia", "ownerIdentity": {"principalId": "A3NL1KOZZKExample"}, "arn": "arn:aws:s3:::kryia"}, 
      "object": {
        "key": `elife-${articleId}-vor-r1.zip`, 
        "size": 753292, 
        "eTag": "f34ebdbbd15ad17c01bdc9e29f99521b", 
        "versionId": null, 
        "sequencer": "0055AED6DCD90281E5"
      }
    }
  }
]});

import startSqsListener from "../../src/listeners/s3-sqs-listener";

describe('S3SQSListener', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    await startSqsListener();
  });
  afterEach(() => {
    eventEmmitter.removeAllListeners();
  });
  it('handles a message without crashing', async () => {
    eventEmmitter.emit('message_received', { Body: JSON.stringify(getMockSQSMessage()) });
    await flushPromise();
    expect(true).toBeTruthy();
  });

  it('does not call import if message received has no Body', async () => {
    expect(importMock).not.toBeCalled();
    eventEmmitter.emit('message_received', { Body: JSON.stringify({ foo: {} }) });
    await flushPromise();
    expect(importMock).not.toBeCalled();
  });
  it('does not call import if message received has no Records or Records has no Length', async () => {
    expect(importMock).not.toBeCalled();
    eventEmmitter.emit('message_received', { Body: JSON.stringify({ Body: { foo: {} } }) });
    await flushPromise();
    expect(importMock).not.toBeCalled();
    eventEmmitter.emit('message_received', { Body: JSON.stringify({ Body: { Records: [] } }) });
    await flushPromise();
    expect(importMock).not.toBeCalled();
  });
  it('emits error when import throws', async () => {
    importMock.mockImplementation(() => { throw new Error('Something went wrong')});
    expect.assertions(1);
    eventEmmitter.on('error', (error) => { expect(error.message).toBe('Something went wrong')})
    eventEmmitter.emit('message_received', { Body: JSON.stringify(getMockSQSMessage()) });
    await flushPromise();
  })
});