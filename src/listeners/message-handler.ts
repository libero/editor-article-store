import AWS from "aws-sdk";

export function parseMessage(message: AWS.SQS.Message): { key: string, bucketName: string }[] {
  try {
    const messageBody = JSON.parse(message.Body || "");
    return messageBody.Records.map((record: any) => ({ key: record.s3.object.key, bucketName: record.s3.bucket.name}));  
  } catch(e) {
    throw new Error('Unable to parse message:' + JSON.stringify(message));
  }
}

export async function handleMessage(importer: (key: string, bucketName: string) => void, message: AWS.SQS.Message) {
  const keyBucketList = parseMessage(message);
      for(const keyBucketItem of keyBucketList) {
        console.log(
          `SQS - S3 upload event received - { Key: ${keyBucketItem.key}, Bucket: ${keyBucketItem.bucketName} }`
        );
        await importer(keyBucketItem.key, keyBucketItem.bucketName);
      }
}