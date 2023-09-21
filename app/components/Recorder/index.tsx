import React, { useEffect } from 'react';
import styles from './recorder.module.scss';
import {
  RecorderProvider,
  useRecorderContext,
} from '../../contexts/RecorderContext';

import RecordRTC, { invokeSaveAsDialog } from 'recordrtc';
import { useErrorModalContext } from '../../contexts/ErrorModalContext';

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

  const { setIsError, setErrorMessage } = useErrorModalContext();
  const toggleRecording = async () => {
    let recorder: RecordRTC;

    if (!isRecording) {
      // If not already recording, then start.
      try {
        // Getting media stream
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        setMediaStream(stream);
        // Instantiating Recorder Object
        recorder = new RecordRTC(stream, {
          type: 'audio',
        });
        // updating recorder context and starting the recorder.
        await startRecording();
        recorder.startRecording();
        setCurrentRecorder(recorder);
      } catch (error) {
        // Update the error context so that the modal is displayed
        setErrorMessage(
          'We encountered an error while accessing the microphone: ' +
            'please ensure your microphone is connected and allowed in the browser. ' +
            'See our troubleshooting guide for details: INSERT LINK HERE',
        );
        // this is what will make the error modal appear.
        setIsError(true);
        console.error('Error accessing the microphone:' + error);

      }
    } else {
      // if current recorder is not null, then stop recording, this is used to be type-safe.
      if (currentRecorder) {
        currentRecorder.stopRecording(() => {
          stopRecording();
          // Stop the stream when recording stops
          clearStreams();
          // Get the blob and save it to the context, so it can be accessed by other components
          const blob = currentRecorder.getBlob();
          setAudioBlob(blob);
          // This is temporary, but will save the audio to your browser, so you know that it is working properly.
          invokeSaveAsDialog(blob);
          // Destroy the recorder and set the context for it to null.
          currentRecorder.destroy();
          setCurrentRecorder(null);
        });
      }
    }
  };

  // Clear the Media streams
  const clearStreams = () => {
    if (mediaStream) {
      mediaStream.getTracks().forEach((track) => track.stop());
    }
  };

  useEffect(() => {
    return () => {
      // Disconnect the stream when unmounting
      clearStreams();
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
const WrappedRecorder: React.FC = () => (
  <RecorderProvider>
    <Recorder />
  </RecorderProvider>
);

export default WrappedRecorder;
