import { openaiConfiguration } from "../../server/config/openAIConfig";

describe("OpenAI Configuration", () => {
  test("OpenAI API Key is defined", () => {
    // Check if the OpenAI API key is defined
    expect(openaiConfiguration?.apiKey).toBeDefined();
  });

  test("OpenAI API Key has valid format", () => {
    // Define the regex pattern for the API key format
    const apiKeyRegex = /^sk-[A-Za-z0-9]+$/;
    // Assert apiKey is of type string and match the regex pattern
    const apiKey = openaiConfiguration?.apiKey as string;
    expect(apiKey).toMatch(apiKeyRegex);
  });

  test("OpenAI API Key has correct length", () => {
    // Define the minimum and maximum length requirements for the API key
    const minimumLength = 32;
    const maximumLength = 64;
    // Assert apiKey is of type string and check its length
    const apiKey = openaiConfiguration?.apiKey as string;
    const apiKeyLength = apiKey.length;
    expect(apiKeyLength).toBeGreaterThanOrEqual(minimumLength);
    expect(apiKeyLength).toBeLessThanOrEqual(maximumLength);
  });
});
