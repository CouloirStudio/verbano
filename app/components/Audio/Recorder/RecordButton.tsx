import React from 'react';
import styles from './recorder.module.scss';
import Image from 'next/image';

export interface RecordButtonProps {
  isRecording: boolean;
  toggleRecording: () => void;
  theme?: 'light' | 'dark';
}

/**
 * RecordButton renders a button to control audio recording.
 * The button's appearance updates according to the recording state.
 * @param isRecording a boolean that represents the recording state
 * @param toggleRecording a function that is called when the button is clicked
 */
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
