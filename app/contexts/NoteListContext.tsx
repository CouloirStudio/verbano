import React, { createContext, ReactNode, useContext, useState } from "react";

/**
 * This component provides context for what is contained in the notes sidebar list.
 */
interface NoteListContextType {
  selectedNotes: string[];
  setSelectedNotes: (notes: string[]) => void;
  clearSelectedNotes: () => void;
}

/**
 * Context for selecting multiple Notes.
 */
const NoteListContext = createContext<NoteListContextType | undefined>(
  undefined,
);

/**
 * A custom hook to access the UserNoteListContext and ensure it is used within
 * the provider.
 */
export const useNoteListContext = (): NoteListContextType => {
  const context = useContext(NoteListContext);

  if (!context) {
    throw new Error(
      'useNoteListContext must be used within a NoteListContextProvider',
    );
  }
  return context;
};

/**
 * Props for the NoteListContextProvider
 */
interface NoteListContextProviderProps {
  children: ReactNode;
}

/**
 * Component for providing NoteListContext.
 * @param children children to be passed to nested components
 */
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
