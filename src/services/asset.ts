import { S3 } from "aws-sdk";
import path from "path";
import { v4 as uuid } from 'uuid';
import { configManager } from "./config-manager";
import convert from '../utils/convert-image-utils';
import { AssetRepository } from "../repositories/assets";
import { Asset } from "../types/asset";

export type AssetService = {
  getArticleAssetIdsByFilename: (articleId: string, fileName: string) => Promise<Asset[]>
  getAsset: (key: string, bucket: string) => Promise<string | Buffer | undefined>;
  getAssetUrl: (key: string) => Promise<string | null>;
  saveAsset: (articleId: string, fileContent: Buffer, mimeType: string, fileName: string) => Promise<string>;
}

export default function assetService(s3: S3, assetRepository: AssetRepository, config: typeof configManager): AssetService {
  const targetBucket = config.get("editorS3Bucket");

  const storeFileToTargetS3 = async (Body: Buffer | string = '', articleId: string, assetId: string, fileName: string, ContentType?: string) => {
    const Key = `${articleId}/${assetId}/${fileName}`;
    const params = {
      Body,
      Bucket: targetBucket,
      Key,
      ACL: "private",
      ContentType,
    };
    await s3.putObject(params).promise();
    console.log(
      `S3 object stored: { Key: ${Key}, Bucket: ${targetBucket} }`
    );
    const _id = await assetRepository.insert({ fileName, assetId, articleId})
    console.log(
      `Asset stored in Db: { _id: ${_id}, Key: ${Key} }`
    );
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
    getArticleAssetIdsByFilename: async (articleId, fileName) => {
      const { assets } = await assetRepository.getByQuery({articleId, fileName});
      return assets;
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
      const assetId = uuid();

      try {
        await storeFileToTargetS3(fileContent, articleId, assetId, fileName, mimeType);
      } catch (error) {
        throw new Error(
          `Error when storing S3 object: { Key: ${articleId}/${assetId}/${fileName}, Bucket: ${targetBucket} } - ${error.message}`
        );
      }

      if (mimeType === 'image/tiff') {
        let convertedTif;
        
        try {
          convertedTif = await convert(
            fileContent
          );
        } catch(error) {
          throw new Error(`Error when converting .tif file: { Key: ${articleId}/${assetId}/${fileName}, Bucket: ${targetBucket} } - ${error.message}`)
        }

        const { name: keyName } = path.parse(fileName)
        try {
          const { buffer: jpgBuffer, contentType: jpgCcontentType } = convertedTif;
          await storeFileToTargetS3(jpgBuffer, articleId, assetId, keyName + ".jpeg", jpgCcontentType?.mime as unknown as string);
        } catch(error) {
          throw new Error(
            `Error when storing S3 object: { Key: ${path.join(articleId, assetId, keyName) + ".jpeg"}, Bucket: ${targetBucket} } converted from .tif file: { Key: ${articleId}/${assetId}/${fileName}, Bucket: ${targetBucket} } - ${error.message}`
          );
        }
        return `${assetId}/${keyName}.jpeg`;
      }
      return `${assetId}/${fileName}`;
    }
  };
}
