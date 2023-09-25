import AWS from 'aws-sdk';

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const S3_BUCKET = process.env.S3_BUCKET || 'verbano-dev-audio';
const s3 = new AWS.S3();

const uploadAudioToS3 = async (audioBuffer: Buffer): Promise<string> => {
  const uploadParams = {
    Bucket: S3_BUCKET,
    Key: `audio-files/${Date.now()}.wav`,
    Body: audioBuffer,
    ContentType: 'audio/wav',
  };

  const result = await s3.upload(uploadParams).promise();
  return result.Location;
};

export { uploadAudioToS3 };
