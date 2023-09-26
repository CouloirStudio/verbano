import { useEffect } from 'react';

const useStreamCleaner = (mediaStream: MediaStream | null) => {
  useEffect(() => {
    return () => {
      if (mediaStream) {
        mediaStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [mediaStream]);
};

export default useStreamCleaner;
