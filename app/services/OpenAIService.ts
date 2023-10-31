import 'dotenv/config';
import OpenAI, { toFile } from 'openai';
import { Audio } from 'openai/resources';
import Transcription = Audio.Transcription;

class OpenAIService {
  private readonly apiKey: string;
  private readonly openai: OpenAI;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.OPENAI_API_KEY || '';
    if (!this.apiKey) {
      throw new Error('API key not provided for OpenAI.');
    }
    this.openai = new OpenAI({
      apiKey: this.apiKey,
    });
    if (!this.openai) {
      throw new Error('Failed to initialize OpenAI.');
    }
  }

  get openaiForTesting() {
    return this.openai;
  }

  public async transcribeAudio(audio: Blob): Promise<Transcription | string> {
    const file = await toFile(audio, 'audio.wav');

    try {
      return await this.openai.audio.transcriptions.create({
        file: file,
        model: 'whisper-1',
      });
    } catch (error) {
      console.log(error);
    }
    return 'something went wrong :(';
  }

  /**
   * Generates a summary report of the given text, using the text's context.
   * @param tts the text to summarize
   * @param context the context of the text
   */
  public async generateReport(
    tts: string,
    context: string,
  ): Promise<string | null> {
    try {
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'user', content: tts },
          { role: 'system', content: context },
        ],
      });
      return completion.choices[0].message.content;
    } catch (error) {
      console.error(error);
      throw new Error('Failed to generate report.');
    }
  }

  /**
   * Generates a list of tags for the given text.
   * @param tts the text to generate tags for
   */
  public async generateTags(tts: string): Promise<string[] | undefined> {
    try {
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content:
              'You will generate a list of 4 content tags related to the following text split by commas:',
          },
          { role: 'user', content: tts },
        ],
      });
      return completion.choices[0].message.content?.split(',');
    } catch (error) {
      console.error(error);
      throw new Error('Failed to generate tags.');
    }
  }

  /**
   * Generates a title for the given text.
   * @param tts the text to generate a title for
   */
  public async generateTitle(tts: string): Promise<string | null> {
    try {
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You will generate a title for the following text:',
          },
          { role: 'user', content: tts },
        ],
      });
      return completion.choices[0].message.content;
    } catch (error) {
      console.error(error);
      throw new Error('Failed to generate title.');
    }
  }
}

export default OpenAIService;
