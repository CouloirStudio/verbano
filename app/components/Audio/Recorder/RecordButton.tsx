import React from 'react';
import styles from './recorder.module.scss';
import { BsFillStopCircleFill, BsRecordCircle } from 'react-icons/bs';

export interface RecordButtonProps {
  isRecording: boolean;
  toggleRecording: () => void;
  theme?: 'light' | 'dark';
}

const RecordButton: React.FC<RecordButtonProps> = ({
  isRecording,
  toggleRecording,
  theme = 'light', // Default to light theme if not provided
}) => (
  <button
    id={'recorderButton'}
    onClick={toggleRecording}
    className={`${styles.recorderButton} ${
      isRecording ? styles.recording : ''
    } ${styles[theme]}`} // Added theme styles here
  >
    {isRecording ? <BsFillStopCircleFill /> : <BsRecordCircle />}
  </button>
);

export default RecordButton;
