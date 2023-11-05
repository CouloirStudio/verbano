import CustomTreeItem from '@/app/components/Projects/ProjectTree/CustomTreeItem';
import Box from '@mui/material/Box';
import styles from '@/app/components/Projects/ProjectTree/projectTree.module.scss';
import Typography from '@mui/material/Typography';
import { ProjectNoteType, ProjectType } from '@/app/graphql/resolvers/types';
import { Draggable } from '@hello-pangea/dnd';
import React, { memo, useEffect, useState } from 'react';
import DeleteProject from '@/app/graphql/mutations/DeleteProject.graphql';
import { useMutation } from '@apollo/client';
import { useProjectContext } from '@/app/contexts/ProjectContext';
import { ContextMenuComponent } from '@/app/components/UI/ContextMenu';
import useDoubleClickEdit from '@/app/hooks/useDoubleClickEdit';
import TextField from '@mui/material/TextField';

interface ProjectTreeItemProps {
  project: ProjectType;
  index: number;
}

const ProjectTreeItem: React.FC<ProjectTreeItemProps> = memo(
  ({ project, index }) => {
    const [contextMenu, setContextMenu] = useState<{
      mouseX: number;
      mouseY: number;
    } | null>(null);
    const [deleteProject] = useMutation(DeleteProject);
    const {
      projects,
      refetchData,
      selectedProject,
      setSelectedProject,
      setSelectedNote,
    } = useProjectContext();

    const {
      isEditing,
      value,
      handleChange,
      handleSubmit,
      handleDoubleClick,
      handleBlur,
      handleKeyDown,
      exitEditing,
    } = useDoubleClickEdit(project.projectName);

    const submitUpdate = async (newValue: string): Promise<void> => {
      console.log('submitUpdate', newValue);
    };

    useEffect(() => {
      if (selectedProject?.id !== project.id && isEditing) {
        exitEditing();
      }
    }, [selectedProject, isEditing, project.id, exitEditing]);

    const handleContextMenu = (event: React.MouseEvent) => {
      event.preventDefault();
      setContextMenu({
        mouseX: event.clientX + 2,
        mouseY: event.clientY - 4,
      });
    };

    const handleClose = () => {
      setContextMenu(null);
    };

    const handleDelete = async () => {
      try {
        //remove the project from the list of projects
        projects?.splice(
          projects.findIndex((projectLoop) => projectLoop.id === project.id),
          1,
        );
        setSelectedProject(null);
        setSelectedNote(null);

        const response = await deleteProject({
          variables: { id: project.id },
        });

        if (!response.data.deleteProject) {
          console.error('Failed to delete the project.');
        }

        handleClose();
        refetchData();
      } catch (err: any) {
        console.error('Error while deleting the project:', err.message);
      }
    };

    return (
      <>
        <Draggable key={project.id} draggableId={project.id} index={index}>
          {(provided2) => (
            <div
              ref={provided2.innerRef}
              {...provided2.draggableProps}
              {...provided2.dragHandleProps}
            >
              <CustomTreeItem
                key={project.id}
                nodeId={project.id.toString()}
                project={project}
                label={
                  <Box
                    onContextMenu={handleContextMenu}
                    className={styles.project}
                    onDoubleClick={handleDoubleClick}
                  >
                    {isEditing ? (
                      <TextField
                        variant="standard"
                        type="text"
                        value={value}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        onKeyDown={(e) => handleKeyDown(e, submitUpdate)}
                        autoFocus
                      />
                    ) : (
                      <Typography>{project.projectName}</Typography>
                    )}
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
              </CustomTreeItem>
            </div>
          )}
        </Draggable>
        <ContextMenuComponent
          contextMenu={contextMenu}
          handleClose={handleClose}
          options={[
            {
              label: 'Edit',
              action: () => console.log('Edit clicked', project.id),
            },
            {
              label: 'Delete',
              action: handleDelete, // It's already scoped to the project.id of this item
            },
          ]}
        />
      </>
    );
  },
);

export default ProjectTreeItem;
