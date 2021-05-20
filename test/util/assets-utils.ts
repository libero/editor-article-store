import AWS from 'aws-sdk';
AWS.config.update({
  region: 'us-east-1',
  accessKeyId: 'test',
  secretAccessKey: 'test',
});
const s3 = new AWS.S3({
  endpoint: 'http://localhost:4566',
  apiVersion: "2006-03-01",
  signatureVersion: "v4",
  s3ForcePathStyle: true,
});

export const clearBuckets = async (buckets: string[]) => {
  for(const Bucket of buckets) {
    const { Contents = [] } = await s3.listObjects({ Bucket }).promise();
    if (Contents.length > 0) {
      await s3
        .deleteObjects({
          Bucket,
          Delete: {
            Objects: Contents.map(({ Key }) => ({ Key: Key as string }))
          }
        })
        .promise();
    }
  }
};

export const populateBucket = async (Bucket: string, Key: string, Body: string) => {
  const params = {
    Body,
    Bucket,
    Key,
    ACL: "private",
    ContentType: "plain/text",
  };
  await s3.putObject(params).promise();
};