import React, { useEffect, useRef } from 'react';
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
    mediaStream,
    startRecording,
    stopRecording,
    setCurrentRecorder,
    setAudioBlob,
    setMediaStream,
  } = useRecorderContext();

  const toggleRecording = async () => {
    let recorder: RecordRTC;

    // If already recording, stop and save the audio
    if (!isRecording) {
      /*
      USE CASES:
      - user rejects use of the microphone,
      - user wants to stop the microphone access/stream after granting it,
      - errors connecting to the microphone
       */
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        setMediaStream(stream);
        recorder = new RecordRTC(stream, {
          type: 'audio',
        });
        startRecording();
        recorder.startRecording();
        setCurrentRecorder(recorder);
      } catch (error) {
        console.error('Error accessing the microphone:', error);
      }
    } else {
      if (currentRecorder) {
        currentRecorder.stopRecording(function () {
          stopRecording();
          const blob = currentRecorder.getBlob();
          setAudioBlob(blob);
          invokeSaveAsDialog(blob);

          // Ensure currentRecorder is defined before calling destroy()
          if (currentRecorder) {
            currentRecorder.destroy();
          }
          setCurrentRecorder(null);

          // Stop the stream when recording stops
          clearStreams();
        });
      }
    }
  };

  const clearStreams = async () => {
    if (mediaStream) {
      mediaStream.getTracks().forEach((track) => track.stop());
    }
  };

  const streamRef = useRef<MediaStream | undefined>();

  useEffect(() => {
    const stream = streamRef.current;
    return () => {
      // Disconnect the stream when unmounting
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

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
