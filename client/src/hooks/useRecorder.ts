import { useContext } from "react";
import { RecorderContext } from "../contexts/app/RecorderContext";

export function useRecorder() {
  const { startRecording, stopRecording } = useContext(RecorderContext);

  return {
    startRecording,
    stopRecording,
  };
}
