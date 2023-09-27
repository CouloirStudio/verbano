import React, { createContext, useContext, useState } from 'react';

type RecorderType = any;
type AudioBlobType = Blob | null;
type MediaStreamType = MediaStream | null;

interface RecorderContextType {
  audioBlob: AudioBlobType;
  setAudioBlob: (blob: AudioBlobType) => void;
}

const RecorderContext = createContext<RecorderContextType | undefined>(
  undefined,
);

interface Props {
  children: React.ReactNode;
}

export const RecorderProvider: React.FC<Props> = ({ children }) => {
  const [audioBlob, setAudioBlob] = useState<AudioBlobType>(null);

  return (
    <RecorderContext.Provider
      value={{
        audioBlob,
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
