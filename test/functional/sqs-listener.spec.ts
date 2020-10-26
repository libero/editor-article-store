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
  region: configManager.get("awsSqsRegion"),
  accessKeyId: configManager.get("awsSqsAccessKey"),
  secretAccessKey: configManager.get("awsSqsSecretAccessKey"),
});
const s3 = new AWS.S3({
  endpoint: configManager.get("awsEndPoint"),
  apiVersion: "2006-03-01",
  signatureVersion: "v4",
  s3ForcePathStyle: true,
});

async function checkFileExists(key: string, bucket: string): Promise<boolean> {
  try {
    await s3
      .headObject({
        Bucket: bucket,
        Key: key,
      })
      .promise();
    return true;
  } catch (error) {
    if (error && error.code === "NotFound") {
      return false;
    }
    throw error;
  }
}

async function waitForConditionOrTimeout(check: Function, limit: number) {
  return new Promise((resolve) => {
    const startTime = new Date().getTime();
    const interval = setInterval(async () => {
      const timeLapsed = new Date().getTime() - startTime;
      const result = await check();
      if (result || timeLapsed >= limit) {
        resolve();
        clearInterval(interval);
      }
    }, 1000);
  });
}

describe("SQS bucket listener", () => {
  test("should upload assets to s3", async () => {
    const kryiaBucket = configManager.get("inputS3Bucket");
    const editorBucket = configManager.get("editorS3Bucket");
    const folderName = new Date()
      .getTime()
      .toString()
      .slice(-5);

    const xmlExists = async () =>
      checkFileExists(`${folderName}/elife-00006.xml`, editorBucket);
    const jpgExists = async () =>
      checkFileExists(`${folderName}/elife-00006-fig1.jpg`, editorBucket);
    const tiffExists = async () =>
      checkFileExists(`${folderName}/elife-00006-fig1.tif`, editorBucket);
    const pdfExists = async () =>
      checkFileExists(`${folderName}/elife-00006.pdf`, editorBucket);

    let xml = await xmlExists();
    let jpg = await jpgExists();
    let tiff = await tiffExists();
    let pdf = await pdfExists();

    expect(xml).toBe(false);
    expect(jpg).toBe(false);
    expect(tiff).toBe(false);
    expect(pdf).toBe(false);

    const zipBuffer = fs.readFileSync(
      path.join(__dirname, "..", "test-files", "elife-00006-vor-r1.zip")
    );

    await s3
      .putObject({
        Body: zipBuffer,
        Bucket: kryiaBucket,
        Key: `elife-${folderName}-vor-r1.zip`,
        ACL: "private",
      })
      .promise();

    await waitForConditionOrTimeout(xmlExists, 50000);

    xml = await xmlExists();
    jpg = await jpgExists();
    tiff = await tiffExists();
    pdf = await pdfExists();

    expect(xml).toBe(true);
    expect(jpg).toBe(true);
    expect(tiff).toBe(true);
    expect(pdf).toBe(true);
  });
});
