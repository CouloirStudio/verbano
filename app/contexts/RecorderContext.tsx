import React, { createContext, ReactNode, useContext, useState } from 'react';
import RecordRTC from 'recordrtc';

type RecorderType = RecordRTC | null;
type AudioBlobType = Blob | null;
type MediaStreamType = MediaStream | null;

interface RecorderContextType {
  currentRecorder: RecorderType;
  isRecording: boolean;
  startRecording: () => void;
  stopRecording: () => void;
  setCurrentRecorder: (recorder: RecorderType) => void;
  audioBlob: AudioBlobType;
  setAudioBlob: (blob: AudioBlobType) => void;
  mediaStream: MediaStreamType;
  setMediaStream: (stream: MediaStreamType) => void;
}

const RecorderContext = createContext<RecorderContextType | undefined>(
  undefined,
);

interface Props {
  children: ReactNode;
}

export const RecorderProvider: React.FC<Props> = ({ children }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [currentRecorder, setCurrentRecorder] = useState<RecorderType>(null);
  const [audioBlob, setAudioBlob] = useState<AudioBlobType>(null);
  const [mediaStream, setMediaStream] = useState<MediaStreamType>(null);

  const startRecording = () => setIsRecording(true);
  const stopRecording = () => setIsRecording(false);

  return (
    <RecorderContext.Provider
      value={{
        currentRecorder,
        isRecording,
        audioBlob,
        mediaStream,
        startRecording,
        stopRecording,
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
    throw new Error(
      'useRecorderContext must be used within a RecorderProvider',
    );
  }
  return context;
};
