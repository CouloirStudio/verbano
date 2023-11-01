import React, { useState } from 'react';
import clsx from 'clsx';
import Box from '@mui/material/Box';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import Typography from '@mui/material/Typography';
import { TreeView } from '@mui/x-tree-view/TreeView';
import {
  TreeItem,
  TreeItemContentProps,
  TreeItemProps,
  useTreeItem,
} from '@mui/x-tree-view/TreeItem';
import ProjectTreeHeader from './ProjectTreeHeader';
import styles from './projectTree.module.scss';
import { useProjectContext } from '../../../contexts/ProjectContext';
import { ProjectNoteType, ProjectType } from '../../../graphql/resolvers/types';
import { Droppable } from '@hello-pangea/dnd';
import { useMutation } from '@apollo/client';
import { ContextMenuComponent } from '@/app/components/UI/ContextMenu';
import DeleteProject from '@/app/graphql/mutations/DeleteProject';

interface CustomTreeContextType {
  project?: ProjectType;
  projectNotes?: ProjectNoteType[];
}

const CustomTreeContext = React.createContext<CustomTreeContextType>({});

const CustomContent = React.forwardRef(function CustomContent(
  props: TreeItemContentProps,
  ref,
) {
  const {
    classes,
    className,
    label,
    nodeId,
    icon: iconProp,
    expansionIcon,
    displayIcon,
  } = props;

  const { project } = React.useContext(CustomTreeContext);

  const {
    disabled,
    expanded,
    selected,
    focused,
    handleExpansion,
    handleSelection,
    preventSelection,
  } = useTreeItem(nodeId);

  const icon = iconProp || expansionIcon || displayIcon;

  const { setSelectedProject } = useProjectContext();

  const handleMouseDown = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) => {
    preventSelection(event);
  };

  const handleLabelClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) => {
    handleSelection(event);
    if (project) {
      setSelectedProject(project);
    }
  };

  return (
    <div
      className={clsx(className, classes.root, {
        [classes.expanded]: expanded,
        [classes.selected]: selected,
        [classes.focused]: focused,
        [classes.disabled]: disabled,
      })}
      onMouseDown={handleMouseDown}
      ref={ref as React.Ref<HTMLDivElement>}
    >
      <div onClick={handleExpansion} className={classes.iconContainer}>
        {icon}
      </div>
      <Typography
        onClick={handleLabelClick}
        component="div"
        className={classes.label}
      >
        {label}
      </Typography>
    </div>
  );
});

const CustomTreeItem = React.forwardRef(function CustomTreeItem(
  props: TreeItemProps & {
    projectNotes?: ProjectNoteType[];
    project?: ProjectType;
  },
  ref: React.Ref<HTMLLIElement>,
) {
  const { project, projectNotes, ...restProps } = props;

  return (
    <CustomTreeContext.Provider value={{ project, projectNotes }}>
      <TreeItem ContentComponent={CustomContent} {...restProps} ref={ref} />
    </CustomTreeContext.Provider>
  );
});

const renderProjectTree = (projects: ProjectType[], handleContextMenu: any) => {
  return projects.map((project: ProjectType) => (
    <Droppable droppableId={`project-${project.id}`} key={project.id}>
      {(provided) => (
        <div ref={provided.innerRef} {...provided.droppableProps}>
          <CustomTreeItem
            key={project.id}
            nodeId={project.id.toString()}
            project={project}
            label={
              <Box
                onContextMenu={(e) => handleContextMenu(e, project.id)}
                className={styles.project}
              >
                <Typography>{project.projectName}</Typography>
                <Typography
                  variant="subtitle1"
                  className={styles.projectNoteCount}
                >
                  {project.notes.length}
                </Typography>
              </Box>
            }
          >
            {project.notes.map((projectNote: ProjectNoteType) => (
              <CustomTreeItem
                key={projectNote.note.id}
                nodeId={projectNote.note.id.toString()}
                label={projectNote.note.noteName}
              />
            ))}
            {provided.placeholder}
          </CustomTreeItem>
        </div>
      )}
    </Droppable>
  ));
};

function ProjectTree() {
  const context = useProjectContext();

  const [contextMenu, setContextMenu] = useState<{
    mouseX: number;
    mouseY: number;
  } | null>(null);
  const [rightClickedProjectId, setRightClickedProjectId] = useState<
    string | null
  >(null);
  const [deleteProject, { loading, error }] = useMutation(DeleteProject);

  const handleContextMenu = (event: React.MouseEvent, projectId: string) => {
    event.preventDefault();
    setContextMenu({
      mouseX: event.clientX + 2,
      mouseY: event.clientY - 4,
    });
    setRightClickedProjectId(projectId);
  };

  const handleClose = () => {
    setContextMenu(null);
  };

  const handleDelete = async () => {
    try {
      const response = await deleteProject({
        variables: { id: rightClickedProjectId },
      });

      if (!response.data.deleteProject) {
        console.error('Failed to delete the project.');
      }

      handleClose();
      context.refetchData();
    } catch (err: any) {
      console.error('Error while deleting the project:', err.message);
    }
  };

  return (
    <Box className={styles.projectList}>
      <ProjectTreeHeader />
      <TreeView
        aria-label="icon expansion"
        defaultCollapseIcon={<ExpandMoreIcon />}
        defaultExpandIcon={<ChevronRightIcon />}
      >
        {renderProjectTree(context.projects, handleContextMenu)}
      </TreeView>

      <ContextMenuComponent
        contextMenu={contextMenu}
        handleClose={handleClose}
        options={[
          {
            label: 'Edit',
            action: () => console.log('Edit clicked'),
          },
          {
            label: 'Delete',
            action: handleDelete,
          },
        ]}
      />
    </Box>
  );
}

export default ProjectTree;
