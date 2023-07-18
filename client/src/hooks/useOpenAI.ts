import {useContext} from 'react';
import {OpenAIContext} from '../contexts/api/OpenAIContext';

function useOpenAI() {
	const context = useContext(OpenAIContext);
	const getReport = async () => {
		// Call the provideReportService of OpenAIContext
	};

	return {
		getReport,
	};
}
