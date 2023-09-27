import { useState } from 'react';
import { uploadAudio } from '../api/audio';
import { useRecorderContext } from '../contexts/RecorderContext';
import { useErrorModalContext } from '../contexts/ErrorModalContext';
import { Recorder } from '../api/recorder';

const useAudioManager = () => {
  // getting recorder instance
  const mediaRecorder = Recorder.getRecorder();
  const { setAudioBlob } = useRecorderContext();

  const { setErrorMessage, setIsError } = useErrorModalContext();

  const [recordingState, setRecordingState] = useState<
    'idle' | 'recording' | 'processing'
  >('idle');

  const handleError = (error: any) => {
    console.error(error);
    setErrorMessage(`${error.message}`);
    setIsError(true);
    mediaRecorder.cleanup();
    setRecordingState('idle');
  };

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

  const stopAndUploadRecording = async () => {
    setRecordingState('processing');
    try {
      const blob = await mediaRecorder.stopRecording();
      const data = await uploadAudio(blob);
      console.log('Uploaded successfully. URL:', data.url);
      setAudioBlob(blob);
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
