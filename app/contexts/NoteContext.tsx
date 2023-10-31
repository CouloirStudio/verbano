import React, { createContext, ReactNode, useContext, useState } from 'react';

/**
 * This component provides context for what is contained in the notes details. Currently just the transcription components.
 */
// Define the shape of your error context
interface NoteContextType {
  transcription: string;
  setTranscription: (transcription: string) => void;
  refreshNoteDetails: () => void;
}

const NoteContext = createContext<NoteContextType | undefined>(undefined);

export const useNoteContext = (): NoteContextType => {
  const context = useContext(NoteContext);

  if (!context) {
    throw new Error('useNoteContext must be used within a NoteContextProvider');
  }
  return context;
};

interface NoteContextProviderProps {
  children: ReactNode;
}

export const NoteContextProvider: React.FC<NoteContextProviderProps> = ({
  children,
}) => {
  const [transcription, setTranscription] =
    useState<string>('No Transcription');
  const [, setRefresh] = useState(0);

  const refreshNoteDetails = () => {
    setRefresh((prev) => prev + 1);
  };

  return (
    <NoteContext.Provider
      value={{
        transcription,
        setTranscription,
        refreshNoteDetails,
      }}
    >
      {children}
    </NoteContext.Provider>
  );
};
