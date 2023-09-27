import { useState } from 'react';
import RecordRTC from 'recordrtc';
import { uploadAudio } from '../api/audio';
import { useRecorderContext } from '../contexts/RecorderContext';
import { useErrorModalContext } from '../contexts/ErrorModalContext';

const useAudioManager = () => {
  const {
    mediaStream,
    currentRecorder,
    setCurrentRecorder,
    setAudioBlob,
    setMediaStream,
  } = useRecorderContext();

  const { setErrorMessage, setIsError } = useErrorModalContext();

  const [recordingState, setRecordingState] = useState<
    'idle' | 'recording' | 'processing'
  >('idle');

  const handleError = (message: string, error: unknown) => {
    console.error(message, error);
    let errorMessage = 'An unexpected error occurred';
    if (typeof error === 'object' && error !== null && 'message' in error) {
      errorMessage = (error as { message?: string }).message || errorMessage;
    }
    setErrorMessage(`${message} ${errorMessage}`);
    setIsError(true);
    setRecordingState('idle');
  };

  const startNewRecording = async () => {
    setRecordingState('processing');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setMediaStream(stream);
      const recorder = new RecordRTC(stream, { type: 'audio' });
      recorder.startRecording();
      setCurrentRecorder(recorder);
      setRecordingState('recording');
    } catch (error) {
      handleError('Error accessing the microphone:', error);
    }
  };

  const stopAndUploadRecording = async () => {
    setRecordingState('processing');
    try {
      if (currentRecorder) {
        await currentRecorder.stopRecording(async () => {
          const blob = currentRecorder.getBlob();
          if (!blob) {
            throw new Error('No blob retrieved');
          }
          const data = await uploadAudio(blob);
          console.log('Uploaded successfully. URL:', data.url);
          setAudioBlob(blob);
          currentRecorder.destroy();
          setCurrentRecorder(null);

          // Cleaning up the media stream immediately after recording stops
          if (mediaStream) {
            mediaStream.getTracks().forEach((track) => track.stop());
            setMediaStream(null);
          }

          setRecordingState('idle');
        });
      }
    } catch (error) {
      handleError('Error stopping or uploading recording:', error);
    }
  };

  return {
    startNewRecording,
    stopAndUploadRecording,
    recordingState,
  };
};

export default useAudioManager;
