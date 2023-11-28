import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { TreeView } from "@mui/x-tree-view/TreeView";
import ProjectTreeHeader from "./ProjectTreeHeader";
import styles from "./projectTree.module.scss";
import { useProjectContext } from "../../../contexts/ProjectContext";
import { PositionedProjectType } from "../../../graphql/resolvers/types";
import ProjectTreeItem from "@/app/components/Projects/ProjectTree/ProjectTreeItem";
import { Droppable } from "@hello-pangea/dnd";
import { useDraggingContext } from "@/app/contexts/DraggingContext";
import { useTheme } from "@mui/material/styles";

/**
 * This component is used for rendering the items within the project tree.
 * @param projects a list of the user's projects
 */
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

/**
 * ProjectTree handles the rendering of the project items, and project tree header.
 */
function ProjectTree() {
  const { projects } = useProjectContext();

  const [localProjects, setLocalProjects] = useState<PositionedProjectType[]>(
    [],
  );

  useEffect(() => {
    if (projects) {
      const sortedProjects = [...projects].sort(
        (a, b) => a.position - b.position,
      );
      setLocalProjects(sortedProjects);
    } else {
      setLocalProjects([]);
    }
  }, [projects]);

  const { draggingItemType } = useDraggingContext();

  useEffect(() => {
    // render project tree when projects list changes
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
