/* eslint-disable */
import React, { createContext, ReactNode, useContext, useState } from "react";

interface RecorderContextType {
  currentRecorder: any;
  isRecording: boolean;
  startRecording: () => void;
  stopRecording: () => void;
  setCurrentRecorder: (recorder: any) => void;
  audioBlob: Blob;
  setAudioBlob: (blob: Blob) => void;
}

const RecorderContext = createContext<RecorderContextType | undefined>(
  undefined,
);

interface Props {
  children: ReactNode;
}

export const RecorderProvider: React.FC<Props> = ({ children }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [currentRecorder, setRecorder] = useState(undefined);
  const [audioBlob, setBlob] = useState(new Blob());

  const setCurrentRecorder = (recorder: any) => setRecorder(recorder);
  const startRecording = () => {
    setIsRecording(true);
  };
  const stopRecording = () => setIsRecording(false);

  const setAudioBlob = (blob: Blob) => setBlob(blob);

  return (
    <RecorderContext.Provider
      value={{
        currentRecorder,
        isRecording,
        audioBlob,
        startRecording,
        stopRecording,
        setCurrentRecorder,
        setAudioBlob,
      }}
    >
      {children}
    </RecorderContext.Provider>
  );
};

export const useRecorderContext = (): RecorderContextType => {
  const context = useContext(RecorderContext);
  if (context === undefined) {
    throw new Error(
      'useRecorderContext must be used within a RecorderProvider',
    );
  }
  return context;
};
