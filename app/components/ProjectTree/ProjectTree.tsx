import React from 'react';
import {TreeView} from '@mui/x-tree-view/TreeView';
import {TreeItem} from '@mui/x-tree-view/TreeItem';
import Box from '@mui/material/Box';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ProjectTreeHeader from "@/app/components/ProjectTree/ProjectTreeHeader";
import styles from './projectTree.module.scss';
import Typography from "@mui/material/Typography";

function ProjectTree({projects}: any) {

  const renderProjectTree = (projects: any) => {
    return projects.map((project: any) => (
      <TreeItem
        key={project.id}
        nodeId={project.id}
        label={
          <Box className={styles.project}>
            <Typography>
              {project.projectName}
            </Typography>
            <Typography variant="subtitle1" className={styles.projectNoteCount}>
              {project.notes.length}
            </Typography>
          </Box>
        }
      >

        {project.notes.map((note: any) => (
          <TreeItem key={note.id} nodeId={note.id} label={note.noteName}/>
        ))}
      </TreeItem>


    ));
  };

  return (
    <Box sx={{minHeight: 180, flexGrow: 1, maxWidth: 300}}>
      <ProjectTreeHeader/>
      <TreeView
        aria-label="icon expansion"
        defaultCollapseIcon={<ExpandMoreIcon/>}
        defaultExpandIcon={<ChevronRightIcon/>}
      >
        {renderProjectTree(projects)}
      </TreeView>
    </Box>
  );
}

export default ProjectTree;
