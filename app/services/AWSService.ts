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
 * Uploads an audio buffer to S3 and returns the S3 object key.
 *
 * @param audioBuffer - The buffer containing audio data to be uploaded.
 * @returns The S3 object key of the uploaded audio.
 * @throws Will throw an error if the upload fails.
 */
const uploadAudioToS3 = async (audioBuffer: Buffer): Promise<string> => {
  const key = `audio-files/${Date.now()}.wav`;

  const uploadParams = {
    Bucket: S3_BUCKET,
    Key: key,
    Body: audioBuffer,
    ContentType: 'audio/wav',
  };

  try {
    await s3.upload(uploadParams).promise();
    return key; // Return the S3 object key instead of the URL.
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error uploading to S3:', error.message);
      throw new Error('Failed to upload audio to S3.');
    } else {
      console.error('An unexpected error occurred:', error);
      throw new Error('Failed to upload audio to S3.');
    }
  }
};

/**
 * Deletes an audio file from S3 using its S3 object key.
 *
 * @param key - The S3 object key of the audio file to delete.
 * @throws Will throw an error if the deletion fails.
 */
const deleteAudioFromS3 = async (key: string) => {
  const deleteParams = {
    Bucket: S3_BUCKET,
    Key: key,
  };

  try {
    await s3.deleteObject(deleteParams).promise();
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error deleting object from S3:', error);
      throw error;
    } else {
      console.error('An unexpected error occurred:', error);
      throw new Error('Failed to delete audio from S3.');
    }
  }
};

/**
 * Generates a pre-signed URL for an audio file using its S3 object key.
 *
 * @param key - The S3 object key of the audio file.
 * @returns The pre-signed URL for the audio file.
 * @throws Will throw an error if URL generation fails.
 */
const generatePresignedUrl = async (key: string): Promise<string> => {
  const params = {
    Bucket: S3_BUCKET,
    Key: key,
    Expires: 3600, // URL expires in 1 hour (adjust as needed)
  };

  try {
    const url = await s3.getSignedUrlPromise('getObject', params);
    return url;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error generating pre-signed URL:', error);
      throw new Error('Failed to generate pre-signed URL.');
    } else {
      console.error('An unexpected error occurred:', error);
      throw new Error('Failed to generate pre-signed URL.');
    }
  }
};

export { uploadAudioToS3, deleteAudioFromS3, generatePresignedUrl };
