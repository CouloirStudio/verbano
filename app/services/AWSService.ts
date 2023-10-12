import AWS from 'aws-sdk';

// Configuring AWS SDK with necessary credentials and region.
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

// Default S3 bucket name.
const S3_BUCKET = process.env.S3_BUCKET || 'verbano-dev-audio';
const s3 = new AWS.S3();

/**
 * Uploads an audio buffer to S3 and returns the audio URL.
 *
 * @param audioBuffer - The buffer containing audio data to be uploaded.
 * @returns The URL location of the uploaded audio.
 * @throws Will throw an error if the upload fails.
 */
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

/**
 * Deletes an audio file from S3 using its URL.
 *
 * @param url - The URL of the audio file to delete.
 * @throws Will throw an error if the deletion fails.
 */
const deleteAudioFromS3 = async (url: string) => {
  const fileKey = url.split('/').pop();

  const deleteParams = {
    Bucket: S3_BUCKET,
    Key: `audio-files/${fileKey}`,
    ContentType: 'blob',
  };

  await s3.deleteObject(deleteParams).promise();
};

/**
 * Fetches an audio file from S3 using its URL.
 *
 * @param url - The URL of the audio file to fetch.
 * @returns The audio data fetched from S3.
 * @throws Will throw an error if fetching fails.
 */
const getAudioFromS3 = async (url: string) => {
  const fileKey = url.split('/').pop();
  const getParams = {
    Bucket: S3_BUCKET,
    Key: `audio-files/${fileKey}`,
  };
  try {
    const response = await s3.getObject(getParams).promise();
    if (response.Body) {
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
