import React from 'react';
import styles from './recorder.module.scss';
import gql from 'graphql-tag';
import {RecorderProvider, useRecorderContext,} from '../../contexts/RecorderContext';

import RecordRTC, {invokeSaveAsDialog} from 'recordrtc';

// GraphQL mutation to create a new note entry with an audio location
const CREATE_NOTE_MUTATION = gql`
  mutation CreateNote($audioLocation: String!) {
    addNote(input: { audioLocation: $audioLocation }) {
      id
      audioLocation
    }
  }
`;

const Recorder: React.FC = () => {
  // Retrieve recording state and control functions from the context
  const {
    audioBlob,
    currentRecorder,
    isRecording,
    startRecording,
    stopRecording,
    setCurrentRecorder,
    setAudioBlob,
  } = useRecorderContext();

  // Apollo Client hook to call the CREATE_NOTE_MUTATION
  // const [createNote] = useMutation(CREATE_NOTE_MUTATION);

  const toggleRecording = async () => {
    let recorder: any;
    // If already recording, stop and save the audio
    if (isRecording) {
      currentRecorder.stopRecording(function () {
        stopRecording();
        let blob = currentRecorder.getBlob();
        setAudioBlob(blob);
        invokeSaveAsDialog(blob);
        //this MUST be inside of the stopRecording function or it will run before the blob is retrieved, causing issues.
        currentRecorder.destroy();
        setCurrentRecorder(undefined);
      });

      // Mock URL for the audio location (replace with logic to upload to AWS S3)
      const mockS3Url = 'https://aws-s3-bucket/your-recording-file.mp3';
      /*
                  try {
                      // Call the mutation to create a new note with the audio URL
                      const { data } = await createNote({ variables: { audioLocation: mockS3Url } });
                      console.log('New note created:', data.addNote);
                  } catch (error) {
                      console.error('Error creating note:', error);
                  }
                  */
    } else {
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then((stream) => {
          recorder = new RecordRTC(stream, {
            type: 'audio',
          });
          recorder.startRecording();
          setCurrentRecorder(recorder);
        })
        .catch((error) => {
          console.error('Error accessing the microphone:', error);
        });
      // If not recording, start
      startRecording();
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
