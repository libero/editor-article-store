import { S3 } from "aws-sdk";
import { configManager } from "./config-manager";
import convert from '../utils/convert-image-utils';
import path from "path";
import { v4 as uuid } from 'uuid';
export type AssetService = {
  getAsset: (key: string, bucket: string) => Promise<string | Buffer | undefined>;
  getAssetUrl: (key: string) => Promise<string | null>;
  saveAsset: (articleId: string, fileContent: Buffer, mimeType: string, fileName: string) => Promise<string>;
}

export default function assetService(s3: S3, config: typeof configManager): AssetService {
  const targetBucket = config.get("editorS3Bucket");

  const storeFileToTargetS3 = async (Body: Buffer | string = '', Key: string, ContentType: string|undefined) => {
    const params = {
      Body,
      Bucket: targetBucket,
      Key,
      ACL: "private",
      ContentType,
    };
    await s3.putObject(params).promise();
  }

  async function checkFileExists(
    key: string
  ): Promise<boolean> {
    try {
      await s3
        .headObject({
          Bucket: targetBucket,
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

  return {
    getAssetUrl: async (key): Promise<string | null> => {
      const exists = await checkFileExists(key);
      if (!exists) {
        return null;
      }
      return s3.getSignedUrl("getObject", {
        Bucket: targetBucket,
        Key: key,
        Expires: 3600,
      });
    },
    getAsset: async (key: string, bucket: string) => {
      const { Body } = await s3
      .getObject({
        Key: key,
        Bucket: bucket,
      })
      .promise();
      return Body as string | Buffer | undefined;
    },

    saveAsset: async (articleId: string, fileContent: Buffer, mimeType: string, fileName: string): Promise<string> => {
      const ext = fileName?.split('.')?.pop() || mimeType?.split('/')?.pop() || '';
      const assetKeyPrefix = `${articleId}/${uuid()}`;
      const assetKey = `${assetKeyPrefix}/${fileName}`;
      try {
        await storeFileToTargetS3(fileContent, assetKey , mimeType);
        console.log(
          `Object stored: { Key: ${assetKey}, Bucket: ${targetBucket} }`
        );
      } catch (error) {
        throw new Error(
          `Error when storing object: { Key: ${assetKey}, Bucket: ${targetBucket} } - ${error.message}`
        );
      }

      if (mimeType === 'image/tiff') {
        let convertedTif;
        
        try {
          convertedTif = await convert(
            fileContent
          );
        } catch(error) {
          throw new Error(`Error when converting .tif file: { Key: ${assetKey}, Bucket: ${targetBucket} } - ${error.message}`)
        }
        const { name: keyName } = path.parse(fileName)
        const jpgAssetKey = path.join(assetKeyPrefix, keyName) + ".jpeg";

        try {
          const { buffer: jpgBuffer, contentType: jpgCcontentType } = convertedTif;
          await storeFileToTargetS3(jpgBuffer, jpgAssetKey, jpgCcontentType?.mime as unknown as string);
          console.log(
            `Object stored: { Key: ${jpgAssetKey}, Bucket: ${targetBucket} }`
          );
        } catch(error) {
          throw new Error(
            `Error when storing object: { Key: ${jpgAssetKey}, Bucket: ${targetBucket} } converted from .tif file: { Key: ${assetKey}, Bucket: ${targetBucket} } - ${error.message}`
          );
        }
        return `${keyName}.jpeg`;
      }
      return fileName;
    }
  };
}
