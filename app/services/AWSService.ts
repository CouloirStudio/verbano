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

  try {
    const result = await s3.upload(uploadParams).promise();
    return result.Location;
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error uploading to S3:', error.message);
    } else {
      console.error('An unexpected error occurred:', error);
    }
    throw new Error('Failed to upload audio to S3.');
  }
};

const deleteAudioFromS3 = async (url: string) => {
  const fileKey = url.split('/').pop(); // Assuming the URL is a direct link to the file

  const deleteParams = {
    Bucket: S3_BUCKET,
    Key: `audio-files/${fileKey}`,
    ContentType: 'blob',
  };

  await s3.deleteObject(deleteParams).promise();
};

const getAudioFromS3 = async (url: string) => {
  console.log('getting audio');
  const fileKey = url.split('/').pop();
  const getParams = {
    Bucket: S3_BUCKET,
    Key: `audio-files/${fileKey}`,
  };
  try {
    // Getting audio file
    const response = await s3.getObject(getParams).promise();
    if (response.Body) {
      // returns data fetched from AWS
      console.log(response.Body);
      return response.Body;
    } else {
      throw new Error('Failed to get object from S3');
    }
  } catch (error) {
    console.error('Error getting object from S3:', error);
    throw error;
  }
};

export { uploadAudioToS3, deleteAudioFromS3, getAudioFromS3 };
