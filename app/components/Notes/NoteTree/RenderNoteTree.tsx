import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Draggable, Droppable } from '@hello-pangea/dnd';
import { ProjectType } from '@/app/graphql/resolvers/types';
import styles from './noteTree.module.scss';
import { useTheme } from '@mui/material/styles';
import { getItemStyle } from './utilityFunctions';
import { useProjectContext } from '@/app/contexts/ProjectContext';

interface RenderNoteTreeProps {
  project: ProjectType | null;
  handleContextMenu: (event: React.MouseEvent, noteId: string) => void;
  selectedNotes: string[];
  setSelectedNotes: React.Dispatch<React.SetStateAction<string[]>>;
}

const RenderNoteTree: React.FC<RenderNoteTreeProps> = ({
  project,
  handleContextMenu,
  selectedNotes,
  setSelectedNotes,
}) => {
  const theme = useTheme();
  const context = useProjectContext();

  const selectedStyle = {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
  };

  const sortedNotes = project?.notes
    ? [...project.notes].sort((a, b) => a.position - b.position)
    : [];

  const handleNoteClick = (event: React.MouseEvent, noteId: string) => {
    if (event.ctrlKey || event.metaKey) {
      // Toggle note in selectedNotes
      if (selectedNotes.includes(noteId)) {
        setSelectedNotes(selectedNotes.filter((id) => id !== noteId));
      } else {
        setSelectedNotes([...selectedNotes, noteId]);
      }
    } else {
      // This is so we don't update the selected note view each time we're multi selecting another

      setSelectedNotes([noteId]);

      // Set the clicked note as the active note in context
      const activeNote = project?.notes.find((n) => n.note.id === noteId)?.note;
      if (activeNote) {
        context.setSelectedNote(activeNote);
      }
    }
  };

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
                    // If the note is the active note, apply the active style
                    context.selectedNote?.id === projectNote.note.id
                      ? styles.active
                      : ''
                  }`}
                  style={{
                    ...getItemStyle(
                      provided.draggableProps.style,
                      snapshot.draggingOverWith === projectNote.note.id,
                      theme,
                    ),
                    // If the note is in the multiselect, and it isn't the active note, apply the selected style
                    ...(selectedNotes.includes(projectNote.note.id) &&
                    context.selectedNote?.id !== projectNote.note.id
                      ? selectedStyle
                      : {}),
                  }}
                  onClick={(e) => handleNoteClick(e, projectNote.note.id)}
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
