import CustomTreeItem from '@/app/components/Projects/ProjectTree/CustomTreeItem';
import Box from '@mui/material/Box';
import styles from '@/app/components/Projects/ProjectTree/projectTree.module.scss';
import Typography from '@mui/material/Typography';
import { ProjectNoteType, ProjectType } from '@/app/graphql/resolvers/types';
import { Draggable, Droppable } from '@hello-pangea/dnd';
import React, { memo, useEffect, useState } from 'react';
import DeleteProject from '@/app/graphql/mutations/DeleteProject.graphql';
import UpdateProject from '@/app/graphql/mutations/UpdateProject.graphql';
import { useMutation } from '@apollo/client';
import { useProjectContext } from '@/app/contexts/ProjectContext';
import { ContextMenuComponent } from '@/app/components/UI/ContextMenu';
import useDoubleClickEdit from '@/app/hooks/useDoubleClickEdit';
import TextField from '@mui/material/TextField';
import { useDraggingContext } from '@/app/contexts/DraggingContext';

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
    const [updateProject] = useMutation(UpdateProject);
    const [name, setName] = useState<string>(project.projectName);

    const {
      projects,
      refetchData,
      selectedProject,
      setSelectedProject,
      setSelectedNote,
    } = useProjectContext();

    const { draggingItemType } = useDraggingContext();

    const style = {
      // Apply transform only if draggingItemType is 'project'
      transform:
        draggingItemType === 'project' ? 'translate(etc, etc)' : 'none',
    };

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
      if (newValue === project.projectName) {
        setName(newValue);
        return;
      }
      if (newValue.trim() === '') {
        setName(project.projectName);
        return;
      }

      setName(newValue.trim());
      try {
        await updateProject({
          variables: {
            id: project.id,
            input: {
              projectName: newValue,
            },
          },
        });
      } catch (e) {
        setName(project.projectName);
        console.error('Error updating note:', e);
      }
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
          projects.findIndex(
            (projectLoop) => projectLoop.project.id === project.id,
          ),
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
        <Draggable
          key={'project-' + project.id}
          draggableId={'project-' + project.id}
          index={index}
        >
          {(draggableProvided) => {
            let customStyle = {};

            // Check if the dragging item type is 'note' and apply transform: none
            if (draggingItemType === 'note') {
              customStyle = {
                ...draggableProvided.draggableProps.style,
                transform: 'none',
              };
            } else {
              customStyle = {
                ...draggableProvided.draggableProps.style,
              };
            }

            return (
              <div
                ref={draggableProvided.innerRef}
                {...draggableProvided.draggableProps}
                {...draggableProvided.dragHandleProps}
                style={customStyle}
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
                  <Droppable
                    droppableId={'project-' + project.id + '-notes'}
                    type={'note'}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={styles.noteList}
                      >
                        {project.notes.map((projectNote: ProjectNoteType) => (
                          <CustomTreeItem
                            key={projectNote.note.id}
                            nodeId={projectNote.note.id.toString()}
                            label={projectNote.note.noteName}
                          />
                        ))}
                      </div>
                    )}
                  </Droppable>
                </CustomTreeItem>
              </div>
            );
          }}
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
