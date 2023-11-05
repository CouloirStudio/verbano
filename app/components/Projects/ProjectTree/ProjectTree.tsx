import React, { useEffect } from 'react';
import Box from '@mui/material/Box';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { TreeView } from '@mui/x-tree-view/TreeView';
import ProjectTreeHeader from './ProjectTreeHeader';
import styles from './projectTree.module.scss';
import { useProjectContext } from '../../../contexts/ProjectContext';
import { ProjectType } from '../../../graphql/resolvers/types';
import ProjectTreeItem from '@/app/components/Projects/ProjectTree/ProjectTreeItem';
import { Droppable } from '@hello-pangea/dnd';

const renderProjectTree = (projects: ProjectType[]) => {
  return projects.map((project: ProjectType, index) => (
    <ProjectTreeItem project={project} index={index} />
  ));
};

function ProjectTree() {
  const { refetchData, setSelectedProject, setSelectedNote, projects } =
    useProjectContext();

  useEffect(() => {
    // render project tree when projects list changes
    renderProjectTree(projects);
  }, [projects]);

  return (
    <Box className={styles.projectList}>
      <ProjectTreeHeader />
      <TreeView
        aria-label="icon expansion"
        defaultCollapseIcon={<ExpandMoreIcon />}
        defaultExpandIcon={<ChevronRightIcon />}
      >
        <Droppable droppableId={'projects'} type={'projects'}>
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              {renderProjectTree(projects)}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </TreeView>
    </Box>
  );
}

export default ProjectTree;
