import { useState } from 'react';
import RecordRTC from 'recordrtc';
import { uploadAudio } from '../api/audio';
import { useRecorderContext } from '../contexts/RecorderContext';

const useAudioManager = () => {
  const {
    mediaStream, // <-- destructuring mediaStream here
    currentRecorder,
    setCurrentRecorder,
    setAudioBlob,
    setMediaStream,
  } = useRecorderContext();

  const [recordingState, setRecordingState] = useState<'idle' | 'recording' | 'processing'>('idle');

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
      console.error('Error accessing the microphone:', error);
      setRecordingState('idle');
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
      console.error(error);
      setRecordingState('idle');
    }
  };

  return {
    startNewRecording,
    stopAndUploadRecording,
    recordingState,
  };
};

export default useAudioManager;
