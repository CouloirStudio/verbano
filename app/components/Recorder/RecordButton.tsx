import React from 'react';
import styles from './recorder.module.scss';

interface RecordButtonProps {
  isRecording: boolean;
  toggleRecording: () => void;
}

const RecordButton: React.FC<RecordButtonProps> = ({
  isRecording,
  toggleRecording,
}) => (
  <button
    onClick={toggleRecording}
    className={`${styles.recorderButton} ${
      isRecording ? styles.recording : ''
    }`}
  >
    {isRecording ? 'Stop' : 'Start'}
  </button>
);

export default RecordButton;
