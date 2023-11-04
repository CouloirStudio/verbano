import 'dotenv/config';
import fetch from 'node-fetch';
import Replicate from 'replicate';

class ReplicateService {
  private readonly replicateApiKey: string;
  private readonly replicateModel: string;
  private replicate: Replicate;

  constructor(replicateApiKey?: string) {
    this.replicateApiKey =
      replicateApiKey || process.env.REPLICATE_API_KEY || '';
    if (!this.replicateApiKey) {
      throw new Error('Replicate API key not provided.');
    }
    this.replicateModel =
      '9aa6ecadd30610b81119fc1b6807302fd18ca6cbb39b3216f430dcf23618cedd';
    this.replicate = new Replicate({
      auth: this.replicateApiKey,
    });
  }

  public async transcribeAudio(s3PresignedUrl: string): Promise<string> {
    // Send the file to Replicate API for transcription

    let prediction = await this.replicate.predictions.create({
      version:
        '9aa6ecadd30610b81119fc1b6807302fd18ca6cbb39b3216f430dcf23618cedd',
      input: {
        audio: s3PresignedUrl,
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
    } while (result.status !== 'succeeded');

    return result.output;
  }
}

export default ReplicateService;
