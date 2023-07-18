import {createContext, useContext, useState} from 'react';

export const OpenAIContext = createContext({
	async provideReportService() {},
});
