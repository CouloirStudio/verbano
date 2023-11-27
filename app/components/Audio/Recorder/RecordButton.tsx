import React from 'react';
import styles from './recorder.module.scss';
import Image from 'next/image';

export interface RecordButtonProps {
  isRecording: boolean;
  toggleRecording: () => void;
  theme?: 'light' | 'dark';
}

const RecordButton: React.FC<RecordButtonProps> = ({
  isRecording,
  toggleRecording,
}) => (
  <button
    id={'recordButton'}
    onClick={toggleRecording}
    className={`${styles.recorderButton} ${
      isRecording ? styles.recording : ''
    }`}
  >
    {isRecording ? (
      <Image
        id={'stopImage'}
        src="/icons/Stop-Button.svg"
        alt="Stop"
        width={163}
        height={42}
      />
    ) : (
      <Image
        id={'recordImage'}
        src="/icons/Record-Button.svg"
        alt="Record"
        width={163}
        height={42}
      />
    )}
  </button>
);

export default RecordButton;
