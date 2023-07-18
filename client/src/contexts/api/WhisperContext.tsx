import {createContext, useContext, useState} from 'react';

export const WhisperContext = createContext({
	async provideTranscriptionService() {},
});
