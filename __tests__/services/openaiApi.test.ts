import OpenAIService from "../../app/services/OpenAIService";
import "openai/shims/node";
import { expect } from "@jest/globals";

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

describe('OpenAIService', () => {
  let service: OpenAIService;

  beforeEach(() => {
    service = new OpenAIService('mock_api_key');
  });

  it('generates a report', async () => {
    const mockText = 'Some text';
    const mockContext = 'Context for the text';
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

    const result = await service.generateReport(mockText, mockContext);
    expect(result).toEqual('Mocked Report');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
