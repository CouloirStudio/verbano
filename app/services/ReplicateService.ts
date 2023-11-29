import 'dotenv/config';
import Replicate, { Prediction } from 'replicate';

interface ProgressInfo {
  progress: number;
  estimatedSecondsLeft?: number;
}

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

    this.replicate = new Replicate({
      auth: this.replicateApiKey,
    });
  }

  /**
   * Transcribes audio from a given S3 presigned URL using the Replicate service.
   * @param {string} s3PresignedUrl - The presigned URL to the S3 object containing the audio to transcribe.
   * @param onProgressUpdate - A callback function that will be called with the progress of the transcription.
   * @returns {Promise<string>} A promise that resolves to the transcribed text.
   * @throws Will throw an error if there is an issue with the API call or if the transcription fails.
   */
  public async transcribeAudio(
    s3PresignedUrl: string,
    onProgressUpdate?: (
      progress: number,
      estimatedSecondsLeft: number | undefined,
    ) => void,
  ): Promise<string> {
    const identifier =
      'openai/whisper:4d50797290df275329f202e48c76360b3f22b08d28c196cbc54600319435f8d2';
    const options = {
      input: {
        audio: s3PresignedUrl,
        align_output: false,
        debug: true,
      },
      wait: {
        interval: 1000,
      },
    };
    const progressCallback = (prediction: Prediction) => {
      const logs = prediction.logs ?? '';
      const latestProgress = getLatestProgress(logs);

      if (latestProgress && onProgressUpdate) {
        console.log('Latest progress:', latestProgress);
        onProgressUpdate(
          latestProgress.progress,
          latestProgress.estimatedSecondsLeft,
        );
      }
    };

    const output: object = await this.replicate.run(
      identifier,
      options,
      progressCallback,
    );

    return JSON.stringify(output);
  }
}

/**
 * Parses the logs from the Replicate API to get the latest progress information.
 * @param logs - The logs from the Replicate API.
 * @returns {ProgressInfo | null} The latest progress information, or `null` if no progress information was found.
 */
const getLatestProgress = (logs: string): ProgressInfo | null => {
  const lines = logs.split('\n');
  for (let i = lines.length - 1; i >= 0; i--) {
    const progressMatch = lines[i].match(/(\d+)%\|/);
    const frameMatch = lines[i].match(
      /\|\s+(\d+)\/(\d+)\s+\[(.+?),\s+(.+?)frames\/s\]/,
    );

    if (
      progressMatch &&
      progressMatch.length > 1 &&
      frameMatch &&
      frameMatch.length > 4
    ) {
      const progress = parseInt(progressMatch[1], 10) / 100;
      const processedFrames = parseInt(frameMatch[1], 10);
      const totalFrames = parseInt(frameMatch[2], 10);
      const framesPerSecond = parseFloat(frameMatch[4]);

      // Calculate estimated time left in seconds
      const estimatedSecondsLeft =
        framesPerSecond > 0
          ? (totalFrames - processedFrames) / framesPerSecond
          : undefined;

      return { progress, estimatedSecondsLeft };
    }
  }
  return null;
};

export default ReplicateService;
