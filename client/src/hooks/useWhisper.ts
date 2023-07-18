import {useContext} from 'react';
import {WhisperContext} from '../contexts/api/WhisperContext';

export function useWhisper() {
	const context = useContext(WhisperContext);

	const getTranscription = async () => {
		try {
			await context.provideTranscriptionService();
		} catch (error) {
			console.error(error);
		}
	};

	return {
		getTranscription,
	};
}
