import { CircularProgress, IconButton } from '@mui/material';
import React from 'react';
import { useMutation } from '@apollo/client';
import { useProjectContext } from '@/app/contexts/ProjectContext';
import { PiNote } from 'react-icons/pi';
import AddNote from '@/app/graphql/mutations/AddNote';

const style = {
  color: '#4d99a8',
  fontSize: '1.6rem',
};

function CreateProjectButton() {
  // Define the mutation hook
  const [addNote, { data, loading, error }] = useMutation(AddNote);

  const context = useProjectContext();

  // Handle the button click
  const handleButtonClick = async () => {
    try {
      const response = await addNote({
        variables: {
          input: {
            noteName: 'New Note',
            tags: [],
            projectId: context.selectedProject?.id,
          },
        },
      });

      console.log('response:', response);
      context.refetchData();
    } catch (e) {
      console.error('Failed to create project:', e);
    }
  };

  return (
    <IconButton onClick={handleButtonClick} disabled={loading} style={style}>
      {loading ? <CircularProgress size={24} /> : <PiNote />}
    </IconButton>
  );
}

export default CreateProjectButton;
