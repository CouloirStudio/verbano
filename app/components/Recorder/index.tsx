import React from 'react';
import styles from './recorder.module.scss';
import {
  RecorderProvider,
  useRecorderContext,
} from '../../contexts/RecorderContext';

import RecordRTC, { invokeSaveAsDialog } from 'recordrtc';

const Recorder: React.FC = () => {
  // Retrieve recording state and control functions from the context
  const {
    currentRecorder,
    isRecording,
    startRecording,
    stopRecording,
    setCurrentRecorder,
    setAudioBlob,
  } = useRecorderContext();

  const toggleRecording = async () => {
    let recorder: RecordRTC;

    // If already recording, stop and save the audio
    if (isRecording) {
      currentRecorder.stopRecording(function () {
        stopRecording();
        const blob = currentRecorder.getBlob();
        setAudioBlob(blob);
        invokeSaveAsDialog(blob);
        //this MUST be inside of the stopRecording function or it will run before the blob is retrieved, causing issues.
        currentRecorder.destroy();
        setCurrentRecorder(undefined);
      });
    } else {
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then((stream) => {
          recorder = new RecordRTC(stream, {
            type: 'audio',
          });
          startRecording();
          recorder.startRecording();
          setCurrentRecorder(recorder);
        })
        .catch((error) => {
          console.error('Error accessing the microphone:', error);
        });
    }
  };

  return (
    <div className={styles.recorder}>
      <button
        onClick={toggleRecording}
        className={`${styles.recorderButton} ${
          isRecording ? styles.recording : ''
        }`}
      >
        {isRecording ? 'Stop Recording' : 'Start Recording'}
      </button>
    </div>
  );
};

// Wrapped component to provide context to the Recorder component
export const WrappedRecorder: React.FC = () => (
  <RecorderProvider>
    <Recorder />
  </RecorderProvider>
);

export default WrappedRecorder;
