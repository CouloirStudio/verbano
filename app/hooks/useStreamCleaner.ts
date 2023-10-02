import { useEffect } from 'react';
import { Recorder } from '@/app/api/recorder';

const useStreamCleaner = (mediaStream: MediaStream | null) => {
  useEffect(() => {
    return () => {
      const mediaRecorder = Recorder.getRecorder();
      mediaRecorder.cleanup();
    };
  }, [mediaStream]);
};

export default useStreamCleaner;
