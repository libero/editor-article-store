import { handleMessage, parseMessage } from '../../src/listeners/message-handler';

const mockSQSMessage = {
  MessageId: "7d32a0c9-59a6-54b7-a64e-1a104acff875",
  ReceiptHandle: "qgxnhmcnihwwfzkyncampkmywejgznjrmulonmqnpimydkodqvbpxdtqjszwidywppnlidlbzmquxtvrdkymareicwzmasxlafddbaeljzetigkfwyxfcrehvwpikletrhaajedqvksnsflhhkgadnodujfpxyuaqlpsocnigukginykhdirrukkv",
  MD5OfBody: "e29131c795e78736d30be12d1a0c3326",
  Body: `{
    "Records": [
      {
        "eventVersion": "2.0",
        "eventSource": "aws:s3",
        "awsRegion": "us-east-1",
        "eventTime": "2020-10-23T11:14:06.036Z",
        "eventName": "ObjectCreated:Put",
        "userIdentity": { "principalId": "AIDAJDPLRKLG7UEXAMPLE" },
        "requestParameters": { "sourceIPAddress": "127.0.0.1" },
        "responseElements": { "x-amz-request-id": "b9c49524", "x-amz-id-2": "eftixk72aD6Ap51TnqcoF8eFidJG9Z/2" },
        "s3": {
          "s3SchemaVersion": "1.0",
          "configurationId": "testConfigRule",
          "bucket": { "name": "kriya", "ownerIdentity": { "principalId": "A3NL1KOZZKExample" }, "arn": "arn:aws:s3:::kryia" },
          "object": {
            "key": "elife-11111-vor-r1.zip",
            "size": 753292,
            "eTag": "f34ebdbbd15ad17c01bdc9e29f99521b",
            "versionId": null,
            "sequencer": "0055AED6DCD90281E5"
          }
        }
      }
    ]
  }`
} as unknown as AWS.SQS.Message;

describe('parseMessage', () => {
  it('parses a message to the corrct format', () => {
    expect(parseMessage(mockSQSMessage)).toEqual([{ key: 'elife-11111-vor-r1.zip', bucketName: 'kriya'}])
  });

  it('throws Unable to parse message error when message is malformed', () => {
    expect(() => parseMessage({ "foo": "Bar" }as unknown as AWS.SQS.Message)).toThrow('Unable to parse message:{\"foo\":\"Bar\"}')
  });
});

describe('handleMessage', () => {
  it('calls import with correct params', async () => {
    const handler = jest.fn();
    await handleMessage(handler, mockSQSMessage);
    expect(handler).toBeCalledTimes(1);
    expect(handler). toBeCalledWith('elife-11111-vor-r1.zip', 'kriya');
  });
});