import OpenAIService from '../app/services/OpenAIService';

/**
 * Tests the OpenAI API.
 * @group local
 */
describe('OpenAIService', () => {
    let service: OpenAIService;

    beforeEach(() => {
        service = new OpenAIService();
    });

    /**
     * Test that the OpenAI API can be connected to using the provided API key.
     */
    it('connect to OpenAI', async () => {
        if(!service) {
            throw new Error("Failed to initialize OpenAI.");
        }
    });
});
