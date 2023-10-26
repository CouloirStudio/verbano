import CreateProjectButton from '@/app/components/ProjectTree/CreateProjectButon';
import React from 'react';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';

const styles = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  fontSize: '1rem',
};

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
