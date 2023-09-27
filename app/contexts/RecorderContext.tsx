import React, { createContext, useContext, useState } from 'react';

// Removed unused types
type AudioBlobType = Blob | null;

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

/**
 * Provides a context for audio recording, including the audio blob and any associated metadata or settings.
 */
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
