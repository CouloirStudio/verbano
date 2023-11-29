import { useEffect } from "react";
import { AudioRecorder } from "@/app/api/recorder";

/**
 * Hook for cleaning media streams from the AudioRecorder object.
 * @param mediaStream media stream to be cleaned
 */
const useStreamCleaner = (mediaStream: MediaStream | null) => {
  useEffect(() => {
    return () => {
      const mediaRecorder = AudioRecorder.getRecorder();
      mediaRecorder.cleanup();
    };
  }, [mediaStream]);
};

export default useStreamCleaner;
