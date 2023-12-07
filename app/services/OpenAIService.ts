import 'dotenv/config';
import OpenAI, { toFile } from 'openai';
import { Audio } from 'openai/resources';
import { INote } from '@/app/models/Note';
import Transcription = Audio.Transcription;

class OpenAIService {
  private readonly apiKey: string;
  private readonly openai: OpenAI;

  /**
   * Constructor for OpenAIService object.
   * @param apiKey an api key to be used
   */
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

  /**
   * Transcribes audio using OpenAI's whisper model.
   * @param audio the audio to be transcribed
   * @returns the transcription, or an error message
   */
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
   * @param notes the notes to generate a summary for
   * @param prompt a custom prompt for summary generation
   * @returns the summary if generated, null if not
   */
  public async generateSummary(
    notes: INote[],
    prompt?: string,
  ): Promise<string | null> {
    try {
      let combinedNotes = '';

      notes.forEach((note) => {
        if (note.transcription != null) {
          const json = JSON.parse(note.transcription);
          const segments = json.segments;
          segments.forEach((segment: any) => {
            //timestamp from seconds in mm:ss
            const seconds = segment.start;
            const minutes = Math.floor(seconds / 60);

            //round to 0 decimal places
            const secondsLeft = Math.floor(seconds % 60);

            const timestamp = `${minutes}:${secondsLeft}`;
            combinedNotes += `(${timestamp}) ${segment.text}\n`;
          });
        }
      });

      console.log(combinedNotes);

      const model =
        combinedNotes.length > 10000
          ? 'gpt-4-1106-preview'
          : 'gpt-3.5-turbo-1106';

      const textPrompt = prompt
        ? `${prompt} (dont start with "summary" heading, just the content) in markdown formatting with included headings (No larger than h4), subheadings, bolded text, and bullet points.`
        : 'Summarize this transcription into key points (dont specify duration) (dont start with "summary" heading, just the content) in markdown formatting with included headings (No larger than h4), subheadings, bolded text, and bullet points.';

      console.log(textPrompt);

      const completion = await this.openai.chat.completions.create({
        model: model,
        messages: [
          { role: 'user', content: combinedNotes },
          {
            role: 'system',
            content: textPrompt,
          },
        ],
      });
      return completion.choices[0].message.content;
    } catch (error) {
      console.error(error);
      throw new Error('Failed to generate summary.');
    }
  }

  /**
   * Generates a list of tags for the given text.
   * @param tts the text to generate tags for
   * @returns the list of tags
   */
  public async generateTags(tts: string): Promise<string[] | undefined> {
    try {
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo-1106',
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
   * @returns the generated title
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
