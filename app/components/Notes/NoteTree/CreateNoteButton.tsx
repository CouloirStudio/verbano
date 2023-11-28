import { CircularProgress, IconButton } from '@mui/material';
import React from 'react';
import { useMutation } from '@apollo/client';
import { useProjectContext } from '@/app/contexts/ProjectContext';
import AddNote from '@/app/graphql/mutations/AddNote';
import { AiOutlinePlus } from 'react-icons/ai';

const style = {
  color: '#4d99a8',
  fontSize: '1.2rem',
};

/**
 * CreateNoteButton provides a button for creating notes.
 */
function CreateNoteButton() {
  // Define the mutation hook
  const [addNote, { data, loading, error }] = useMutation(AddNote);

  const context = useProjectContext();

  /**
   * This function handles the creation of the note when the button is clicked.
   */
  const handleButtonClick = async () => {
    const notesWithContainsName = context.selectedProject?.notes?.filter(
      (note) => note.note.noteName.includes('New Note'),
    );
    // Create a new note, and if multiple "New Note" notes exist, append a number between braces- New Note (#)
    const newNoteName =
      notesWithContainsName && notesWithContainsName?.length > 0
        ? `New Note (${notesWithContainsName.length})`
        : 'New Note';

    try {
      const response = await addNote({
        variables: {
          input: {
            noteName: newNoteName,
            tags: [],
            projectId: context.selectedProject?.id,
          },
        },
      });
      context.refetchData();
    } catch (e) {
      console.error('Failed to create project:', e);
    }
  };

  return (
    <IconButton
      id={'createNoteButton'}
      onClick={handleButtonClick}
      disabled={loading}
      style={style}
    >
      {loading ? <CircularProgress size={24} /> : <AiOutlinePlus />}
    </IconButton>
  );
}

export default CreateNoteButton;
