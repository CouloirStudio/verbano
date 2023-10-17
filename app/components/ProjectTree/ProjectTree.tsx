import React from 'react';
import { TreeView } from '@mui/x-tree-view/TreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

function ProjectTree({ projects }) {
  const renderProjectTree = (projects) => {
    return projects.map((project) => (
      <TreeItem
        key={project.id}
        nodeId={project.id}
        label={project.projectName}
      >
        {project.notes.map((note) => (
          <TreeItem key={note.id} nodeId={note.id} label={note.noteName} />
        ))}
      </TreeItem>
    ));
  };

  return (
    <Box sx={{ minHeight: 180, flexGrow: 1, maxWidth: 300 }}>
      <TreeView
        aria-label="icon expansion"
        defaultCollapseIcon={<ExpandMoreIcon />}
        defaultExpandIcon={<ChevronRightIcon />}
      >
        {renderProjectTree(projects)}
      </TreeView>
    </Box>
  );
}

export default ProjectTree;
