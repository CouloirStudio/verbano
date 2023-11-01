import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Draggable, Droppable } from '@hello-pangea/dnd';
import { NoteType, ProjectType } from '@/app/graphql/resolvers/types';
import styles from './noteTree.module.scss';
import { useTheme } from '@mui/material/styles';
import { getItemStyle } from './utilityFunctions';
import { useProjectContext } from '@/app/contexts/ProjectContext';
import TextField from '@mui/material/TextField';
import { useMutation } from '@apollo/client';
import UpdateNote from '@/app/graphql/mutations/UpdateNote';

interface RenderNoteTreeProps {
  project: ProjectType | null;
  handleContextMenu: (event: React.MouseEvent, noteId: string) => void;
}

const RenderNoteTree: React.FC<RenderNoteTreeProps> = ({
  project,
  handleContextMenu,
}) => {
  const [updateNote, { data }] = useMutation(UpdateNote);

  useEffect(() => {
    if (project?.notes) {
      const sortedNotes = [...project.notes].sort(
        (a, b) => a.position - b.position,
      );
      setLocalNotes(sortedNotes);
    }
  }, [project]);

  const theme = useTheme();
  const context = useProjectContext();

  // Create a sorted copy of the notes
  const sortedNotes = project?.notes
    ? [...project.notes].sort((a, b) => a.position - b.position)
    : [];

  const [localNotes, setLocalNotes] = useState(sortedNotes);

  const handleClick = (note: NoteType) => {
    if (context.selectedNote?.id !== note.id) {
      setEditingId(null);
      setEditingValue('');
    }

    context.setSelectedNote(note);
  };

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState<string>('');

  const handleDoubleClick = (noteId: string, noteName: string) => {
    setEditingId(noteId);
    setEditingValue(noteName);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditingValue(event.target.value);
  };

  const handleSubmitEditing = async () => {
    if (editingId && editingValue !== null) {
      const newNotes = localNotes.map((note) =>
        note.note.id === editingId
          ? { ...note, note: { ...note.note, noteName: editingValue } }
          : note,
      );

      setLocalNotes(newNotes);
      setEditingId(null);

      try {
        await updateNote({
          variables: {
            id: editingId,
            input: {
              noteName: editingValue,
            },
          },
          // No need for optimisticResponse here since we've already updated the local state
        });
      } catch (e) {
        console.error('Error updating note:', e);
        // Optionally, revert the local change if the update fails
      }
    }
  };

  const handleInputBlur = () => {
    handleSubmitEditing();
  };

  const handleInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSubmitEditing();
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
          {localNotes.map((projectNote, index) => (
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
                  onClick={() => handleClick(projectNote.note)}
                  onDoubleClick={() =>
                    handleDoubleClick(
                      projectNote.note.id,
                      projectNote.note.noteName,
                    )
                  }
                >
                  {editingId === projectNote.note.id ? (
                    <TextField
                      variant={'standard'}
                      type="text"
                      value={editingValue}
                      onChange={handleInputChange}
                      onBlur={handleInputBlur}
                      onKeyDown={handleInputKeyDown}
                      autoFocus
                    />
                  ) : (
                    <Typography>{projectNote.note.noteName}</Typography>
                  )}
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
