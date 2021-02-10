import AWS from "aws-sdk";
import fs from "fs";
import path from "path";

import { configManager } from "../../src/services/config-manager";
import { defaultConfig } from "../../src/config/default";
import {
  createConfigFromArgs,
  createConfigFromEnv,
} from "../../src/utils/config-utils";

jest.setTimeout(60000);

// Load the configuration for this service with the following precedence...
//   process args > environment vars > config file.
configManager.apply(defaultConfig);
configManager.apply(createConfigFromEnv(process.env));
configManager.apply(createConfigFromArgs(process.argv));

AWS.config.update({
  region: configManager.get("awsRegion"),
  accessKeyId: configManager.get("awsAccessKey"),
  secretAccessKey: configManager.get("awsSecretAccessKey"),
});
const s3 = new AWS.S3({
  endpoint: configManager.get("awsEndpoint"),
  apiVersion: "2006-03-01",
  signatureVersion: "v4",
  s3ForcePathStyle: true,
});
const sqs = new AWS.SQS();

async function checkMessagesProcessed(): Promise<boolean> {
  try {
    const { Attributes } =  await sqs.getQueueAttributes({ QueueUrl: configManager.get('awsBucketInputEventQueueUrl'), AttributeNames: ['ApproximateNumberOfMessages'] }).promise();
    return !!Attributes &&  Attributes['ApproximateNumberOfMessages'] === '0';
  } catch (error) {
      return false;
    }
}

async function waitForConditionOrTimeout(check: Function, limit: number) {
  return new Promise<void>((resolve) => {
    const startTime = new Date().getTime();
    const interval = setInterval(async () => {
      const timeLapsed = new Date().getTime() - startTime;
      const result = await check();
      if (result || timeLapsed >= limit) {
        resolve();
        clearInterval(interval);
      }
    }, 1500);
  });
}

describe("SQS bucket listener", () => {
  test("should upload assets to s3", async () => {
    const kryiaBucket = configManager.get("srcS3Bucket");
    const editorBucket = configManager.get("editorS3Bucket");
    const folderName = new Date()
      .getTime()
      .toString()
      .slice(-5);

    const zipBuffer = fs.readFileSync(
      path.join(__dirname, "..", "test-files", "elife-00006-vor-r1.zip")
    );
    const bucketContentBefore = await s3.listObjects({ Prefix: folderName, Bucket: editorBucket}).promise();
    expect(bucketContentBefore.Contents).toHaveLength(0);
    await s3
      .putObject({
        Body: zipBuffer,
        Bucket: kryiaBucket,
        Key: `elife-${folderName}-vor-r1.zip`,
        ACL: "private",
      })
      .promise();
    await waitForConditionOrTimeout(checkMessagesProcessed, 50000)
    
    const { Contents = []} = await s3.listObjects({ Prefix: folderName, Bucket: editorBucket}).promise();
    const contentsString = JSON.stringify(Contents);
    expect(contentsString).toContain('elife-00006.xml');
    expect(contentsString).toContain('elife-00006-fig1.jpeg');
    expect(contentsString).toContain('elife-00006-fig1.tif');
    expect(contentsString).toContain('elife-00006.pdf');
  });
});
