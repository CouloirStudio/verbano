import 'dotenv/config';
import fetch from 'node-fetch';
import Replicate from 'replicate';

/**
 * The `ReplicateService` class provides methods to interact with the Replicate API for audio transcription.
 * It requires an API key for authentication, which can be provided via a constructor argument or environment variables.
 */
class ReplicateService {
  /**
   * The API key used to authenticate with the Replicate service.
   */
  private readonly replicateApiKey: string;

  /**
   * The model identifier for the Replicate service.
   */
  private readonly replicateModel: string;

  /**
   * An instance of the `Replicate` class from the `replicate` library.
   */
  private replicate: Replicate;

  /**
   * Constructs a new instance of the `ReplicateService`.
   * @param {string} [replicateApiKey] - The API key for the Replicate service. If not provided, it will attempt to read from the environment variable `REPLICATE_API_KEY`.
   * @throws Will throw an error if the API key is not provided or found in the environment variables.
   */
  constructor(replicateApiKey?: string) {
    this.replicateApiKey =
      replicateApiKey || process.env.REPLICATE_API_KEY || '';
    if (!this.replicateApiKey) {
      throw new Error('Replicate API key not provided.');
    }
    this.replicateModel =
      '4d50797290df275329f202e48c76360b3f22b08d28c196cbc54600319435f8d2';
    this.replicate = new Replicate({
      auth: this.replicateApiKey,
    });
  }

  /**
   * Transcribes audio from a given S3 presigned URL using the Replicate service.
   * @param {string} s3PresignedUrl - The presigned URL to the S3 object containing the audio to transcribe.
   * @returns {Promise<string>} A promise that resolves to the transcribed text.
   * @throws Will throw an error if there is an issue with the API call or if the transcription fails.
   */
  public async transcribeAudio(s3PresignedUrl: string): Promise<string> {
    // Send the file to Replicate API for transcription
    let prediction = await this.replicate.predictions.create({
      version: this.replicateModel,
      input: {
        audio: s3PresignedUrl,
        align_output: false,
        debug: true,
      },
    });

    prediction = await this.replicate.wait(prediction, {
      interval: 1000,
    });

    // Poll the prediction to see if it's completed
    let result;
    do {
      const resultResponse = await fetch(
        `https://api.replicate.com/v1/predictions/${prediction.id}`,
        {
          headers: {
            Authorization: `Token ${this.replicateApiKey}`,
          },
        },
      );
      result = await resultResponse.json();
      if (result.error) {
        throw new Error(result.error.message);
      }
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log(result);
    } while (result.status !== 'succeeded');

    return result.output;
  }
}

export default ReplicateService;
