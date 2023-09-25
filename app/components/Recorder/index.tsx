import React from 'react';
import styles from './recorder.module.scss';
import RecordButton from './RecordButton';
import useAudioManager from '../../hooks/useAudioManager';
import useStreamCleaner from '../../hooks/useStreamCleaner';
import { useRecorderContext } from '../../contexts/RecorderContext';

const Recorder: React.FC = () => {
  const { isRecording, mediaStream } = useRecorderContext();
  const { startNewRecording, stopAndUploadRecording } = useAudioManager();

  useStreamCleaner(mediaStream);

  const toggleRecording = async () => {
    try {
      if (!isRecording) {
        await startNewRecording();
      } else {
        await stopAndUploadRecording();
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className={styles.recorder}>
      <RecordButton
        isRecording={isRecording}
        toggleRecording={toggleRecording}
      />
    </div>
  );
};

export default Recorder;
