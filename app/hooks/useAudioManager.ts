import { useState } from 'react';
import { useErrorModalContext } from '../contexts/ErrorModalContext';
import { AudioRecorder } from '../api/recorder';
import { useProjectContext } from '@/app/contexts/ProjectContext';
import { uploadAudio } from '@/app/api/audio';

/**
 * Custom hook to manage the audio recording and uploading functionalities.
 * @returns An object with methods to start a new recording, stop and upload the recording, and the current recording state.
 */
const useAudioManager = () => {
  const mediaRecorder = AudioRecorder.getRecorder();
  const BASE_URL = 'http://localhost:3000';
  const { setErrorMessage, setIsError } = useErrorModalContext();
  const { selectedProject, selectedNote } = useProjectContext(); // Retrieve selectedProject from context

  const [recordingState, setRecordingState] = useState<
    'idle' | 'recording' | 'processing'
  >('idle');

  /**
   * Handles any errors that occur during recording or uploading.
   * @param error - The error object.
   */
  const handleError = (error: unknown) => {
    console.error(error);

    if (typeof error === 'object' && error !== null && 'message' in error) {
      setErrorMessage(`${(error as Error).message}`);
    } else {
      setErrorMessage(`An unknown error occurred.`);
    }

    setIsError(true);
    mediaRecorder.cleanup();
    setRecordingState('idle');
  };

  /**
   * Starts a new audio recording.
   */
  const startNewRecording = async () => {
    setRecordingState('processing');
    try {
      await mediaRecorder.initialize();
      mediaRecorder.startRecording();
      setRecordingState('recording');
    } catch (error) {
      handleError(error);
    }
  };

  /**
   * Stops the ongoing recording and uploads the recorded audio.
   */
  const stopAndUploadRecording = async () => {
    setRecordingState('processing');
    try {
      const blob = await mediaRecorder.stopRecording();
      await uploadAudio(blob, BASE_URL, selectedProject, selectedNote);
      mediaRecorder.cleanup();
      setRecordingState('idle');
    } catch (error) {
      handleError(error);
    }
  };

  return {
    startNewRecording,
    stopAndUploadRecording,
    recordingState,
  };
};

export default useAudioManager;
