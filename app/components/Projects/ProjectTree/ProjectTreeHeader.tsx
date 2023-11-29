import CreateProjectButton from '@/app/components/Projects/ProjectTree/CreateProjectButton';
import React from 'react';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';

const styles = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  fontSize: '1rem',
};

/**
 * ProjectTreeHeader is a header for the project tree.
 * It contains the CreateProjectButton.
 */
function ProjectTreeHeader() {
  const theme = useTheme();
  return (
    <div style={styles}>
      <Typography variant="h5" style={{ color: theme.palette.primary.main }}>
        {' '}
        Projects{' '}
      </Typography>
      <CreateProjectButton />
    </div>
  );
}

export default ProjectTreeHeader;
