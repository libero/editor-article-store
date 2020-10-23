import AWS from "aws-sdk";

import { configManager } from "../../src/services/config-manager";
import { defaultConfig } from "../../src/config/default";
import {
  createConfigFromArgs,
  createConfigFromEnv,
} from "../../src/utils/config-utils";

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

async function checkFileExists(key, bucket) {
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

describe("SQS bucket listener", () => {
  test("should upload assets to s3", async () => {
    const xmlExists = checkFileExists(`elife-00005-vor-r1/elife-00005.xml`, configManager.get('editorS3Bucket'));
    const jpgExists = checkFileExists(`elife-00005-vor-r1/elife-00005.jpg`, configManager.get('editorS3Bucket'));
    const tiffExists = checkFileExists(`elife-00005-vor-r1/elife-00005.tif`, configManager.get('editorS3Bucket'));
    const pdfExists = checkFileExists(`elife-00005-vor-r1/elife-00005.pdf`, configManager.get('editorS3Bucket'));
    expect(xmlExists).toBe(false);
    expect(jpgExists).toBe(false);
    expect(tiffExists).toBe(false);
    expect(pdfExists).toBe(false);
  });
});
