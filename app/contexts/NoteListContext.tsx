import React, { createContext, ReactNode, useContext, useState } from 'react';

/**
 * This component provides context for what is contained in the notes sidebar list.
 */
interface NoteListContextType {
  selectedNotes: string[];
  setSelectedNotes: (notes: string[]) => void;
  clearSelectedNotes: () => void;
}

const NoteListContext = createContext<NoteListContextType | undefined>(
  undefined,
);

export const useNoteListContext = (): NoteListContextType => {
  const context = useContext(NoteListContext);

  if (!context) {
    throw new Error(
      'useNoteListContext must be used within a NoteListContextProvider',
    );
  }
  return context;
};

interface NoteListContextProviderProps {
  children: ReactNode;
}

export const NoteListContextProvider: React.FC<
  NoteListContextProviderProps
> = ({ children }) => {
  const [selectedNotes, setSelectedNotes] = useState<string[]>([]);

  const clearSelectedNotes = () => {
    setSelectedNotes([]);
  };

  return (
    <NoteListContext.Provider
      value={{
        selectedNotes,
        setSelectedNotes,
        clearSelectedNotes,
      }}
    >
      {children}
    </NoteListContext.Provider>
  );
};
