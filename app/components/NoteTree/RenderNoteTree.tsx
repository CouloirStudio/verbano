import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Draggable, Droppable } from '@hello-pangea/dnd';
import { ProjectType } from '@/app/resolvers/types';
import styles from './noteTree.module.scss';
import { useTheme } from '@mui/material/styles';
import { getItemStyle } from './utilityFunctions';
import { useProjectContext } from '@/app/contexts/ProjectContext';

interface RenderNoteTreeProps {
  project: ProjectType | null;
  handleContextMenu: (event: React.MouseEvent, noteId: string) => void;
}

const RenderNoteTree: React.FC<RenderNoteTreeProps> = ({
  project,
  handleContextMenu,
}) => {
  const theme = useTheme();
  console.log(theme);
  const context = useProjectContext();

  // Create a sorted copy of the notes
  const sortedNotes = project?.notes
    ? [...project.notes].sort((a, b) => a.position - b.position)
    : [];

  return (
    <Droppable droppableId="notes">
      {(provided, snapshot) => (
        <Box
          className={styles.noteList}
          ref={provided.innerRef}
          {...provided.droppableProps}
        >
          {sortedNotes.map((projectNote, index) => (
            <Draggable
              key={projectNote.note.id}
              draggableId={projectNote.note.id}
              index={index}
            >
              {(provided) => (
                <Box
                  onContextMenu={(e) =>
                    handleContextMenu(e, projectNote.note.id)
                  }
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                  className={`${styles.note} ${
                    context.selectedNote?.id === projectNote.note.id
                      ? styles.selected
                      : ''
                  }`}
                  style={getItemStyle(
                    provided.draggableProps.style,
                    snapshot.draggingOverWith === projectNote.note.id,
                    theme,
                  )}
                  onClick={() => context.setSelectedNote(projectNote.note)}
                >
                  <Typography>{projectNote.note.noteName}</Typography>
                </Box>
              )}
            </Draggable>
          ))}
          {provided.placeholder}
        </Box>
      )}
    </Droppable>
  );
};

export default RenderNoteTree;
