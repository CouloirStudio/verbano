import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { TreeView } from '@mui/x-tree-view/TreeView';
import ProjectTreeHeader from './ProjectTreeHeader';
import styles from './projectTree.module.scss';
import { useProjectContext } from '../../../contexts/ProjectContext';
import { PositionedProjectType } from '../../../graphql/resolvers/types';
import ProjectTreeItem from '@/app/components/Projects/ProjectTree/ProjectTreeItem';
import { Droppable } from '@hello-pangea/dnd';
import { useDraggingContext } from '@/app/contexts/DraggingContext';
import { useTheme } from '@mui/material/styles';
import { Skeleton, Stack } from '@mui/material';

const renderProjectTree = (projects: PositionedProjectType[]) => {
  return projects.map((project: PositionedProjectType, index) => (
    <ProjectTreeItem
      key={project.project.id}
      project={project.project}
      index={index}
      className={styles.projectTreeItem}
    />
  ));
};

function ProjectTree() {
  const { refetchData, setSelectedProject, setSelectedNote, projects } =
    useProjectContext();
  const [loading, setLoading] = useState(true);

  const [localProjects, setLocalProjects] = useState<PositionedProjectType[]>(
    [],
  );

  useEffect(() => {
    if (projects) {
      const sortedProjects = [...projects].sort(
        (a, b) => a.position - b.position,
      );
      setLocalProjects(sortedProjects);
      setTimeout(() => setLoading(false), 1500);
    } else {
      setLoading(true);
    }
  }, [projects]);

  const renderSkeletons = () => {
    return (
      <Stack spacing={1}>
        {[...Array(5)].map((_, index) => (
          <Skeleton key={index} variant="rounded" height={40} />
        ))}
      </Stack>
    );
  };

  const { draggingItemType } = useDraggingContext();

  useEffect(() => {
    renderProjectTree(localProjects);
  }, [projects, draggingItemType]);

  const theme = useTheme();
  const sidebarBg = theme.custom?.moreContrastBackground ?? '';

  return (
    <Box className={styles.projectList} sx={{ backgroundColor: sidebarBg }}>
      <ProjectTreeHeader />
      <TreeView
        aria-label="icon expansion"
        defaultCollapseIcon={<ExpandMoreIcon />}
        defaultExpandIcon={<ChevronRightIcon />}
      >
        <Droppable
          droppableId={'projects'}
          isCombineEnabled={draggingItemType === 'note'}
          type={'project'}
        >
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              {loading ? renderSkeletons() : renderProjectTree(localProjects)}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </TreeView>
    </Box>
  );
}

export default ProjectTree;
