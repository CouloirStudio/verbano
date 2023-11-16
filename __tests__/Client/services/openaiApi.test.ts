import OpenAIService from '../../../app/services/OpenAIService';
import 'openai/shims/node';
import {expect} from '@jest/globals';
import {INote} from '@/app/models/Note';

// Mock the OpenAI class and the method chat.completions.create
jest.mock('openai', () => {
  return {
    __esModule: true, // this property makes it behave like an esmodule
    default: jest.fn().mockImplementation(() => {
      // mock the constructor
      return {
        chat: {
          completions: {
            create: jest.fn(),
          },
        },
      };
    }),
  };
});

const mockNote = {
  transcription: 'Note 1 text',
  noteName: 'Note 1',
  noteDescription: 'Note 1 description',
  getProjectId: jest.fn().mockResolvedValue(null),
} as unknown as INote;

describe('OpenAIService', () => {
  let service: OpenAIService;

  beforeEach(() => {
    service = new OpenAIService('mock_api_key');
  });

  it('generates a report', async () => {
    const mockContext = 'Context for the text';
    const mockNotes = [mockNote];
    const mockResponse = {
      choices: [
        {
          message: {
            content: 'Mocked Report',
          },
        },
      ],
    };

    // Mock the API call
    (
      service.openaiForTesting.chat.completions.create as jest.Mock
    ).mockResolvedValue(mockResponse);

    const result = await service.generateSummary(mockNotes, mockContext);
    expect(result).toEqual('Mocked Report');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
