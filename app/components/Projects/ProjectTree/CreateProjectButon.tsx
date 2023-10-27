import { CircularProgress, IconButton } from '@mui/material';
import React from 'react';
import { useMutation } from '@apollo/client';
import AddProject from '@/app/graphql/mutations/AddProject';
import { AiOutlinePlus } from 'react-icons/ai';
import { useProjectContext } from '@/app/contexts/ProjectContext'; // adjust the path accordingly

const style = {
  color: '#4d99a8',
  fontSize: '1.2rem',
};

function CreateProjectButton() {
  // Define the mutation hook
  const [addProject, { data, loading, error }] = useMutation(AddProject);

  const context = useProjectContext();

  // Handle the button click
  const handleButtonClick = async () => {
    try {
      const response = await addProject({
        variables: {
          input: {
            projectName: 'New Project',
          },
        },
      });

      context.refetchData();
    } catch (e) {
      console.error('Failed to create project:', e);
    }
  };

  return (
    <IconButton onClick={handleButtonClick} disabled={loading} style={style}>
      {loading ? <CircularProgress size={24} /> : <AiOutlinePlus />}
    </IconButton>
  );
}

export default CreateProjectButton;
