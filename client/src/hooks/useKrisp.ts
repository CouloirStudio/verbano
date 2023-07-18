import {useContext} from 'react';
import {KrispContext} from '../contexts/api/KrispContext';

function useKrisp() {
	const context = useContext(KrispContext);
	const reduceNoise = async () => {
		// Call the provideNoiseReductionService of KrispContext
	};

	return {
		reduceNoise,
	};
}
