import CreateProjectButton from "@/app/components/ProjectTree/CreateProjectButon";
import React from "react";
import Typography from "@mui/material/Typography";


const styles = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  fontSize: '1rem',
}

function ProjectTreeHeader() {
  return (
    <div style={styles}>
      <Typography variant="h5">Projects</Typography>
      <CreateProjectButton/>
    </div>

  );
}

export default ProjectTreeHeader;