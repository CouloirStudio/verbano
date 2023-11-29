import { ProjectNoteType, ProjectType } from '@/app/graphql/resolvers/types';
import React from 'react';
import {
  TreeItem,
  TreeItemContentProps,
  TreeItemProps,
  useTreeItem,
} from '@mui/x-tree-view/TreeItem';
import { useProjectContext } from '@/app/contexts/ProjectContext';
import clsx from 'clsx';
import Typography from '@mui/material/Typography';
import { useMutation } from '@apollo/client';
import UpdateNote from '@/app/graphql/mutations/UpdateNote.graphql';

interface CustomTreeContextType {
  project?: ProjectType;
  projectNotes?: ProjectNoteType[];
}

const CustomTreeContext = React.createContext<CustomTreeContextType>({});

const CustomContent = React.forwardRef(function CustomContent(
  props: TreeItemContentProps,
  ref: React.Ref<HTMLDivElement>,
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
  const [updateNote] = useMutation(UpdateNote);

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
      ref={ref}
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
    customClassName?: string; // Add a customClassName prop
  },
  ref: React.Ref<HTMLLIElement>,
) {
  const { project, projectNotes, className, customClassName, ...restProps } =
    props;

  return (
    <CustomTreeContext.Provider value={{ project, projectNotes }}>
      <TreeItem
        ContentComponent={React.forwardRef(
          (contentProps: TreeItemContentProps, ref) => (
            <CustomContent
              {...contentProps}
              ref={ref as React.Ref<HTMLDivElement>}
              className={`${contentProps.className} ${customClassName}`}
            />
          ),
        )}
        className={className} // Use the className prop for MUI styles
        {...restProps}
        ref={ref}
      />
    </CustomTreeContext.Provider>
  );
});

export default CustomTreeItem;
