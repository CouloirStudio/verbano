import CreateProjectButton from "@/app/components/ProjectTree/CreateProjectButon";
import React from "react";


const styles = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  fontSize: '1rem',
}

function ProjectTreeHeader() {
  return (
    <div style={styles}>
      <h2>Projects</h2>
      <CreateProjectButton/>
    </div>

  );
}

export default ProjectTreeHeader;