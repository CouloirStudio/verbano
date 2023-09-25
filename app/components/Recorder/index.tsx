import React, { useEffect } from 'react';
import styles from './recorder.module.scss';
import {
  RecorderProvider,
  useRecorderContext,
} from '../../contexts/RecorderContext';

import RecordRTC from 'recordrtc';
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
      if (currentRecorder) {
        currentRecorder.stopRecording(async function () {
          stopRecording();
          clearStreams();

          const blob = currentRecorder.getBlob();

          // Use FormData for sending the audio blob
          const formData = new FormData();
          formData.append('audio', blob, 'myAudioBlob.wav'); // Add blob to form data

          try {
            const response = await fetch('http://localhost:3000/audio/upload', {
              method: 'POST',
              body: formData,
            });

            const data = await response.json();

            if (data.success) {
              console.log('Uploaded successfully. URL:', data.url);
            } else {
              throw new Error(data.message || 'Failed to upload.');
            }
          } catch (error) {
            console.error('Error uploading audio:', error);
          }

          setAudioBlob(blob);
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
        {isRecording ? 'Stop' : 'Start'}
      </button>
    </div>
  );
};

const WrappedRecorder: React.FC = () => (
  <RecorderProvider>
    <Recorder />
  </RecorderProvider>
);

export default WrappedRecorder;
