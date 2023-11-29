import React, { createContext, ReactNode, useContext, useState } from "react";

/**
 * This component provides context for what is contained in the notes details. Currently just the transcription components.
 */
// Define the shape of your error context
interface NoteContextType {
  transcription: string;
  setTranscription: (transcription: string) => void;
  summary: string;
  setSummary: (summary: string) => void;
  refreshNoteDetails: () => void;
}

/**
 * Context for Note items.
 */
const NoteContext = createContext<NoteContextType | undefined>(undefined);

/**
 * Custom hook for using the NoteContext from within a provider
 *
 * @throws Will throw an error if used outside of NoteContextProvider.
 * @returns {NoteContextType} the note context
 */
export const useNoteContext = (): NoteContextType => {
  const context = useContext(NoteContext);

  if (!context) {
    throw new Error('useNoteContext must be used within a NoteContextProvider');
  }
  return context;
};

/**
 * Props for the NoteContext
 */
interface NoteContextProviderProps {
  children: ReactNode;
}

/**
 * A component for providing NoteContext.
 * @param children NoteContextProviderProps
 */
export const NoteContextProvider: React.FC<NoteContextProviderProps> = ({
  children,
}) => {
  const [transcription, setTranscription] =
    useState<string>('No Transcription');
  const [summary, setSummary] = useState<string>('No Summary');
  const [, setRefresh] = useState(0);

  const refreshNoteDetails = () => {
    setRefresh((prev) => prev + 1);
  };

  return (
    <NoteContext.Provider
      value={{
        transcription,
        setTranscription,
        summary,
        setSummary,
        refreshNoteDetails,
      }}
    >
      {children}
    </NoteContext.Provider>
  );
};
