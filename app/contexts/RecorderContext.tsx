import React, { createContext, ReactNode, useContext, useState } from 'react';

type RecorderType = any;
type AudioBlobType = Blob | null;
type MediaStreamType = MediaStream | null;

interface RecorderContextType {
  currentRecorder: RecorderType;
  audioBlob: AudioBlobType;
  mediaStream: MediaStreamType;
  setCurrentRecorder: (recorder: RecorderType) => void;
  setAudioBlob: (blob: AudioBlobType) => void;
  setMediaStream: (stream: MediaStreamType) => void;
}

const RecorderContext = createContext<RecorderContextType | undefined>(undefined);

interface Props {
  children: React.ReactNode;
}

export const RecorderProvider: React.FC<Props> = ({ children }) => {
  const [currentRecorder, setCurrentRecorder] = useState<RecorderType>(null);
  const [audioBlob, setAudioBlob] = useState<AudioBlobType>(null);
  const [mediaStream, setMediaStream] = useState<MediaStreamType>(null);

  return (
    <RecorderContext.Provider
      value={{
        currentRecorder,
        audioBlob,
        mediaStream,
        setCurrentRecorder,
        setAudioBlob,
        setMediaStream,
      }}
    >
      {children}
    </RecorderContext.Provider>
  );
};

export const useRecorderContext = (): RecorderContextType => {
  const context = useContext(RecorderContext);
  if (context === undefined) {
    throw new Error('useRecorderContext must be used within a RecorderProvider');
  }
  return context;
};
