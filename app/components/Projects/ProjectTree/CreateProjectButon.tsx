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
    const projectsWithContainsName = context.projects?.filter((project) =>
      project.project.projectName.includes('New Project'),
    );
    // Create a new project, and if multiple "New Project" projects exist, append a number between braces- New Project (#)
    const newProjectName =
      projectsWithContainsName && projectsWithContainsName?.length > 0
        ? `New Project (${projectsWithContainsName.length})`
        : 'New Project';
    try {
      const response = await addProject({
        variables: {
          input: {
            projectName: newProjectName,
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
