import dotenv from 'dotenv';
dotenv.config();

import {Configuration, OpenAIApi} from 'openai';

const configuration = new Configuration({
	apiKey: process.env.OPENAI_API_KEY,
	// You can set your organization ID here if you have one.
	// organization: "org-XXXX",
});

const openai = new OpenAIApi(configuration);

export const openaiConfiguration = configuration;
export default openai;
