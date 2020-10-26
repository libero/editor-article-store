import { S3 } from "aws-sdk";
import { configManager } from "./config-manager";

async function checkFileExists(s3: S3, key: string, bucket: string) {
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

export default (s3: S3, config: typeof configManager) => ({
  getAssetUrl: async (
    articleId: string,
    fileKey: string
  ): Promise<string | null> => {
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
});
