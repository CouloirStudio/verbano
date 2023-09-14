import React, { createContext, useContext, useState, ReactNode } from 'react';

interface RecorderContextType {
  isRecording: boolean;
  startRecording: () => void;
  stopRecording: () => void;
}

const RecorderContext = createContext<RecorderContextType | undefined>(
  undefined,
);

interface Props {
  children: ReactNode;
}

export const RecorderProvider: React.FC<Props> = ({ children }) => {
  const [isRecording, setIsRecording] = useState(false);

  const startRecording = () => setIsRecording(true);
  const stopRecording = () => setIsRecording(false);

  return (
    <RecorderContext.Provider
      value={{ isRecording, startRecording, stopRecording }}
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
