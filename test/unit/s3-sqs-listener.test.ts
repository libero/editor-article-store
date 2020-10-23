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

const mockMongoInsert = jest.fn();
jest.mock('mongodb', () => ({
  MongoClient: {
    connect: () => Promise.resolve({
      db: () => ({
        collection: () => ({
          insertOne: mockMongoInsert
        })
      })
    })
  }
}));

const s3GetObjectMock = jest.fn();
const s3PutObjectMock = jest.fn()
jest.mock('aws-sdk', ()=> ({
  config: {
    update: jest.fn()
  },
  S3: jest.fn().mockImplementation(() => ({
    getObject: s3GetObjectMock,
    putObject: s3PutObjectMock
  })),
  SQS: jest.fn()
}));
const decompressMock = jest.fn();
jest.mock('decompress', () => decompressMock);

jest.mock('file-type', () => ({ 
  fromBuffer: () => ({ mime: 'text/xml' }) 
}));

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
    jest.resetAllMocks();
    s3GetObjectMock.mockImplementation(() => ({ promise: jest.fn(() => Promise.resolve({ Body: 'someBody' }))}));
    s3PutObjectMock.mockImplementation(() => ({ promise: jest.fn(() => Promise.resolve())}));
    decompressMock.mockImplementation(() => Promise.resolve([{
        path: '/elife-54296-vor-r1.xml',
        data: () => 'somecontent'
      }]));
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
  it('calls getObject on S3 with correct key and Bucket config when valid message received', async () => {
    expect(s3GetObjectMock).not.toBeCalled();
    eventEmmitter.emit('message_received', { Body: JSON.stringify(getMockSQSMessage()) });
    await flushPromise();
    expect(s3GetObjectMock).toBeCalledWith({ Key: 'elife-54296-vor-r1.zip', Bucket: 'kryia' });
  });
  it('does not call getObject on S3 if message received has no Body', async () => {
    expect(s3GetObjectMock).not.toBeCalled();
    eventEmmitter.emit('message_received', { Body: JSON.stringify({ foo: {} }) });
    await flushPromise();
    expect(s3GetObjectMock).not.toBeCalled();
  });
  it('does not call getObject on S3 if message received has no Records or Records has no Length', async () => {
    expect(s3GetObjectMock).not.toBeCalled();
    eventEmmitter.emit('message_received', { Body: JSON.stringify({ Body: { foo: {} } }) });
    await flushPromise();
    expect(s3GetObjectMock).not.toBeCalled();
    eventEmmitter.emit('message_received', { Body: JSON.stringify({ Body: { Records: [] } }) });
    await flushPromise();
    expect(s3GetObjectMock).not.toBeCalled();
  });
  it('emits the correct error if getObject throws', async () => {
    s3GetObjectMock.mockImplementation(() => { throw new Error('Some call error') });
    expect.assertions(1);
    eventEmmitter.on('error', (error) => { expect(error.message).toBe('Error when fetching and unzipping object: { Key: elife-54296-vor-r1.zip, Bucket: kryia } - Error: Some call error')})
    eventEmmitter.emit('message_received', { Body: JSON.stringify(getMockSQSMessage()) });
    await flushPromise();
  });
  it('emits the correct error if getObject responds with error', async () => {
    s3GetObjectMock.mockImplementation(() => ({ promise: () => {throw new Error('Some response error') }}));
    expect.assertions(1);
    eventEmmitter.on('error', (error) => { expect(error.message).toBe('Error when fetching and unzipping object: { Key: elife-54296-vor-r1.zip, Bucket: kryia } - Error: Some response error')})
    eventEmmitter.emit('message_received', { Body: JSON.stringify(getMockSQSMessage()) });
    await flushPromise();
  });
  it('unzips the returned object from s3', async () => {
    expect(decompressMock).not.toBeCalled();
    s3GetObjectMock.mockImplementation(() => ({ promise: () => Promise.resolve({ Body: 'someBody' })}));
    eventEmmitter.emit('message_received', { Body: JSON.stringify(getMockSQSMessage()) });
    await flushPromise();
    expect(decompressMock).toBeCalledWith('someBody');
  });

  it('trys to put all extracted files into an s3 bucket under articleId collection', async () => {
    decompressMock.mockImplementation(() => Promise.resolve([{
      path: '/elife-54296-vor-r1.xml',
      data: 'somecontent'
    }]));
    expect(s3PutObjectMock).not.toBeCalled();
    eventEmmitter.emit('message_received', { Body: JSON.stringify(getMockSQSMessage()) });
    await flushPromise();
    expect(s3PutObjectMock).toBeCalledWith({
        "ACL": "private",
        "Body": 'somecontent',
        "Bucket": "editor",
        "ContentType": "text/xml",
        "Key": "54296/elife-54296-vor-r1.xml",
       });
    s3PutObjectMock.mockReset();
    decompressMock.mockImplementation(() => Promise.resolve([{
      path: '/elife-11111-vor-r1.xml',
      data: 'someOtherContent'
    }]));
    eventEmmitter.emit('message_received', { Body: JSON.stringify(getMockSQSMessage('11111')) });
    await flushPromise();
    expect(s3PutObjectMock).toBeCalledWith({
      "ACL": "private",
      "Body": 'someOtherContent',
      "Bucket": "editor",
      "ContentType": "text/xml",
      "Key": "11111/elife-11111-vor-r1.xml",
     });
  });
  it('converts .tif files to jpeg and uploads both to s3 bucket', async () => {
    decompressMock.mockImplementation(() => Promise.resolve([{
      path: '/elife-54296-vor-r1.xml',
      data: 'somecontent'
    },{
      path: '/someAsset.tif',
      data: 'assetContent'
    }]));
    expect(s3PutObjectMock).not.toBeCalled();
    eventEmmitter.emit('message_received', { Body: JSON.stringify(getMockSQSMessage()) });
    await flushPromise();
    //expect Body & ContentType to not be defined as convert-image is being passed mocked file data
    expect(s3PutObjectMock).toBeCalledTimes(3);
    expect(s3PutObjectMock.mock.calls[1]).toEqual([{
      "ACL": "private",
      "Body": 'assetContent',
      "Bucket": "editor",
      "ContentType": 'text/xml',
      "Key": "54296/someAsset.tif",
    }]);
    expect(s3PutObjectMock.mock.calls[2]).toEqual([{
        "ACL": "private",
        "Body": '',
        "Bucket": "editor",
        "ContentType": undefined,
        "Key": "54296/someAsset.jpg",
       }]);
  });
  it('converts multiple .tif files to jpeg and uploads s3 bucket', async () => {
    decompressMock.mockImplementation(() => Promise.resolve([{
      path: '/elife-54296-vor-r1.xml',
      data: 'somecontent'
    },{
      path: '/someAsset1.tif',
      data: 'assetContent'
    },{
      path: '/someAsset2.tif',
      data: 'assetContent'
    },{
      path: '/someAsset3.tif',
      data: 'assetContent'
    }]));
    expect(s3PutObjectMock).not.toBeCalled();
    eventEmmitter.emit('message_received', { Body: JSON.stringify(getMockSQSMessage()) });
    await flushPromise();
    expect(s3PutObjectMock).toBeCalledTimes(7);
  });
  it('emits the correct error if putObject responds with error', async () => {
    s3PutObjectMock.mockImplementation(() => {throw new Error('Some call error') });
    expect.assertions(1);
    eventEmmitter.on('error', (error) => { expect(error.message).toBe('Error when storing object: { Key: 54296/elife-54296-vor-r1.xml, Bucket: editor } - Error: Some call error')})
    eventEmmitter.emit('message_received', { Body: JSON.stringify(getMockSQSMessage()) });
    await flushPromise();
  });
  it('emits the correct error if putObject responds with error', async () => {
    s3PutObjectMock.mockImplementation(() => ({ promise: () => {throw new Error('Some response error') }}));
    expect.assertions(1);
    eventEmmitter.on('error', (error) => { expect(error.message).toBe('Error when storing object: { Key: 54296/elife-54296-vor-r1.xml, Bucket: editor } - Error: Some response error')})
    eventEmmitter.emit('message_received', { Body: JSON.stringify(getMockSQSMessage()) });
    await flushPromise();
  });
  it('emits the correct error if no xml file is found', async () => {
    decompressMock.mockImplementation(() => Promise.resolve([{
      path: '/someAsset.tif',
      data: 'assetContent'
    }]));
    expect.assertions(1);
    eventEmmitter.on('error', (error) => { expect(error.message).toBe('Error finding article XML file in object: { Key: elife-54296-vor-r1.zip, Bucket: kryia }')})
    eventEmmitter.emit('message_received', { Body: JSON.stringify(getMockSQSMessage()) });
    await flushPromise();
  })
});