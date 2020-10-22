import { S3 } from 'aws-sdk';
import { configManager } from "./config-manager";

export default (s3: S3, config: typeof configManager) => ({
  getAssetUrl: (articleId: string, fileKey: string): string => {
    return s3.getSignedUrl('getObject', {
      Bucket: config.get('editorS3Bucket'),
      Key: `${articleId}/${fileKey}`,
      Expires: 3600
  })
  }
});