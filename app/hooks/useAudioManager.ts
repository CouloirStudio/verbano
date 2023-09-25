import RecordRTC from 'recordrtc';
import { uploadAudio } from '../api/audio';
import { useRecorderContext } from '../contexts/RecorderContext';

const useAudioManager = () => {
  const {
    currentRecorder,
    startRecording,
    stopRecording,
    setCurrentRecorder,
    setAudioBlob,
    setMediaStream,
  } = useRecorderContext();

  const startNewRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setMediaStream(stream);
      const recorder = new RecordRTC(stream, { type: 'audio' });
      startRecording();
      recorder.startRecording();
      setCurrentRecorder(recorder);
    } catch (error) {
      console.error('Error accessing the microphone:', error);
    }
  };

  const stopAndUploadRecording = async () => {
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
        });
        stopRecording();
      }
    } catch (error) {
      console.error(error);
    }
  };

  return {
    startNewRecording,
    stopAndUploadRecording,
  };
};

export default useAudioManager;
