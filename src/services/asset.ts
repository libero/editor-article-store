import { S3 } from "aws-sdk";
import {v4 as uuidv4} from 'uuid';

import { configManager } from "./config-manager";
import convert from '../listeners/convert-image';

async function checkFileExists(
  s3: S3,
  key: string,
  bucket: string
): Promise<boolean> {
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

export type AssetService = {
  getAssetUrl: (articleId: string, fileKey: string) => Promise<string | null>;
  saveFileToS3: (articleId: string, fileContent: Buffer, mimeType: string, fileName: string) => Promise<string>;
}

const storeFileToTargetS3 = async (s3:S3, targetBucket: string, Body: Buffer, Key: string, ContentType: string) => {
  await s3.putObject({
    Body,
    Bucket: targetBucket,
    Key,
    ACL: "private",
    ContentType,
  }).promise();
}

export default function assetService(s3: S3, config: typeof configManager): AssetService {
  return {
    getAssetUrl: async (articleId: string, fileKey: string): Promise<string | null> => {
      const key = `${articleId}/${fileKey}`;
      const bucket = config.get("editorS3Bucket");
      const exists = await checkFileExists(s3, key, bucket);
      if (!exists) {
        return null;
      }
      return s3.getSignedUrl("getObject", {
        Bucket: bucket,
        Key: key,
        Expires: 3600,
      });
    },

    saveFileToS3: async (articleId: string, fileContent: Buffer, mimeType: string, fileName: string): Promise<string> => {
      const bucketName = config.get("editorS3Bucket");
      const ext = fileName.split('.').pop() || mimeType.split('/').pop();
      const uniqueFileId = uuidv4();

      await storeFileToTargetS3(s3, bucketName, fileContent, `${articleId}/${uniqueFileId}.${ext}`, mimeType);

      if (mimeType === 'image/tiff') {
        const {buffer: jpgImage} = await convert(fileContent);
        if (!jpgImage) {
          throw new TypeError(`Failed to convert TIFF image to JPEG`);
        }
        await storeFileToTargetS3(s3, bucketName, jpgImage, `${articleId}/${uniqueFileId}.jpg`, mimeType);
        return `${uniqueFileId}.jpg`;
      }
      return `${uniqueFileId}.${ext}`;
    }
  };
}
