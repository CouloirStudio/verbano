import React, {useContext} from 'react';
import {useRecorder} from '../../hooks/app/useRecorder';
import Button from '../shared/Button';

const Recorder: React.FC = () => {
	const {startRecording, stopRecording} = useRecorder();

	return (
		<div>
			<Button onClick={startRecording}>Start Recording</Button>
			<Button onClick={stopRecording}>Stop Recording</Button>
		</div>
	);
};

export default Recorder;
