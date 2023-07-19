import {useContext} from 'react';
import {ReportContext} from '../../contexts/app/ReportContext';

function useReport() {
	const {generateReport, exportReport} = useContext(ReportContext);

	return {
		generateReport,
		exportReport,
	};
}
