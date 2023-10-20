import React from 'react';
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
import ProjectTreeHeader from '../ProjectTree/ProjectTreeHeader';
import styles from './projectTree.module.scss';
import { useProjectContext } from '../../contexts/ProjectContext';
import { NoteType, ProjectType } from '../../resolvers/types';
import { Droppable } from '@hello-pangea/dnd';

type CustomContentPropsExtended = TreeItemContentProps & {
  notes?: NoteType[];
  project?: ProjectType;
};

const CustomContent = React.forwardRef(function CustomContent(
  props: CustomContentPropsExtended,
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

  const { setSelectedNote, setSelectedProject } = useProjectContext();

  const handleMouseDown = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) => {
    preventSelection(event);
  };

  const handleLabelClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) => {
    handleSelection(event);
    if (props.project) {
      setSelectedProject(props.project);
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
  props: TreeItemProps & { notes?: NoteType[]; project?: ProjectType },
  ref: React.Ref<HTMLLIElement>,
) {
  return (
    <TreeItem
      ContentComponent={CustomContent}
      ContentProps={{ project: props.project }}
      {...props}
      ref={ref}
    />
  );
});

const renderProjectTree = (projects: ProjectType[]) => {
  return projects.map((project: ProjectType) => (
    <Droppable droppableId={`project-${project.id}`} key={project.id}>
      {(provided) => (
        <div ref={provided.innerRef} {...provided.droppableProps}>
          <CustomTreeItem
            key={project.id}
            nodeId={project.id.toString()}
            project={project}
            label={
              <Box className={styles.project}>
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
            {project.notes.map((note: NoteType) => (
              <CustomTreeItem
                key={note.id}
                nodeId={note.id.toString()}
                label={note.noteName}
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
  const { projects } = useProjectContext();

  return (
    <Box className={styles.projectList}>
      <ProjectTreeHeader />
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
