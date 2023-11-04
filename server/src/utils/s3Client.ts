import AWS from "aws-sdk";

export const getS3 = async (key: string) => {
  const bucketName = process.env.S3_BUCKET;
  AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    sessionToken: process.env.AWS_SESSION_TOKEN,
    region: "ap-southeast-2",
  });
  const s3 = new AWS.S3({ apiVersion: "2006-03-01" });
  const s3Key = `${key}`;
  const params = { Bucket: bucketName!, Key: s3Key };
  try {
    const s3Result = await s3.getObject(params).promise();
    const s3JSON = JSON.parse(s3Result.Body?.toString()!);
    return s3JSON;
  } catch (err: any) {
    if (err.statusCode === 404) {
      console.error(`Value not found`);
    } else {
      console.error(err.message);
    }
  }
};
export const setS3 = async (key: string, value: any) => {
  AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    sessionToken: process.env.AWS_SESSION_TOKEN,
    region: "ap-southeast-2",
  });
  const bucketName = process.env.S3_BUCKET;
  const s3 = new AWS.S3({ apiVersion: "2006-03-01" });
  const body = JSON.stringify({
    source: "S3 Bucket",
    value,
  });
  const objectParams = { Bucket: bucketName!, Key: key, Body: body };
  await s3.putObject(objectParams).promise();
  console.log(`Successfully uploaded data to ${bucketName}${key}`);
};
