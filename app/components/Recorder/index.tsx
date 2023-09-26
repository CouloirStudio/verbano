import React from 'react';
import styles from './recorder.module.scss';
import RecordButton from './RecordButton';
import useAudioManager from '../../hooks/useAudioManager';
import useStreamCleaner from '../../hooks/useStreamCleaner';
import { useRecorderContext } from '../../contexts/RecorderContext';

const Recorder: React.FC = () => {
  const { mediaStream } = useRecorderContext();
  const { startNewRecording, stopAndUploadRecording, recordingState } = useAudioManager();

  useStreamCleaner(mediaStream);

  const toggleRecording = async () => {
    try {
      if (recordingState === 'idle') {
        await startNewRecording();
      } else if (recordingState === 'recording') {
        await stopAndUploadRecording();
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className={styles.recorder}>
      {recordingState === 'processing' ? (
        <span>Processing...</span>
      ) : (
        <RecordButton
          isRecording={recordingState === 'recording'}
          toggleRecording={toggleRecording}
        />
      )}
    </div>
  );
};

export default Recorder;
