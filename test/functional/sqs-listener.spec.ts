import waitForExpect from "wait-for-expect";
import AWS from "aws-sdk";
import fs from "fs";
import path from "path";

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

async function checkFileExists(key: string, bucket: string) {
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
    const kryiaBucket = configManager.get("inputS3Bucket");
    const folderName = new Date()
      .getTime()
      .toString()
      .slice(0, 5);
    let xmlExists = await checkFileExists(
      `${folderName}/elife-00006.xml`,
      configManager.get("editorS3Bucket")
    );
    let jpgExists = await checkFileExists(
      `${folderName}/elife-00006-fig1.jpg`,
      configManager.get("editorS3Bucket")
    );
    let tiffExists = await checkFileExists(
      `${folderName}/elife-00006-fig1.tif`,
      configManager.get("editorS3Bucket")
    );
    let pdfExists = await checkFileExists(
      `${folderName}/elife-00006.pdf`,
      configManager.get("editorS3Bucket")
    );

    const zipBuffer = fs.readFileSync(
      path.join(__dirname, "..", "test-files", "elife-00006-vor-r1.zip")
    );

    expect(xmlExists).toBe(false);
    expect(jpgExists).toBe(false);
    expect(tiffExists).toBe(false);
    expect(pdfExists).toBe(false);

    await s3
      .putObject({
        Body: zipBuffer,
        Bucket: kryiaBucket,
        Key: "elife-00006-vor-r1.zip",
        ACL: "private",
      })
      .promise();

    setTimeout(async () => {
      xmlExists = await checkFileExists(
        `${folderName}/elife-00006.xml`,
        configManager.get("editorS3Bucket")
      );
      jpgExists = await checkFileExists(
        `${folderName}/elife-00006-fig1.jpg`,
        configManager.get("editorS3Bucket")
      );
      tiffExists = await checkFileExists(
        `${folderName}/elife-00006-fig1.tif`,
        configManager.get("editorS3Bucket")
      );
      pdfExists = await checkFileExists(
        `${folderName}/elife-00006.pdf`,
        configManager.get("editorS3Bucket")
      );

      expect(
        await checkFileExists(
          `${folderName}/elife-00006.xml`,
          configManager.get("editorS3Bucket")
        )
      ).toBe(true);
      expect(jpgExists).toBe(true);
      expect(tiffExists).toBe(true);
      expect(pdfExists).toBe(true);
    }, 50000);
  });
});
