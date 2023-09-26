import React from 'react';
import styles from './recorder.module.scss';

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
    onClick={toggleRecording}
    className={`${styles.recorderButton} ${
      isRecording ? styles.recording : ''
    } ${styles[theme]}`} // Added theme styles here
  >
    {isRecording ? 'Stop' : 'Start'}
  </button>
);

export default RecordButton;
