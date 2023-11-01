import React, { useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import { Draggable } from '@hello-pangea/dnd';
import { NoteType } from '@/app/graphql/resolvers/types';
import styles from './noteTree.module.scss';
import { useTheme } from '@mui/material/styles';
import { getItemStyle } from './utilityFunctions';
import { useProjectContext } from '@/app/contexts/ProjectContext';
import { useMutation } from '@apollo/client';
import UpdateNote from '@/app/graphql/mutations/UpdateNote';
import useDoubleClickEdit from '@/app/hooks/useDoubleClickEdit';

interface NoteTreeItemProps {
  note: NoteType;
  index: number;
  handleContextMenu: (event: React.MouseEvent, noteId: string) => void;
}

const NoteTreeItem: React.FC<NoteTreeItemProps> = ({
  note,
  index,
  handleContextMenu,
}) => {
  const theme = useTheme();
  const context = useProjectContext();
  const [updateNote] = useMutation(UpdateNote);

  const handleClick = () => {
    if (context.selectedNote?.id !== note.id) {
      context.setSelectedNote(note);
    }
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
  } = useDoubleClickEdit(note.noteName);

  useEffect(() => {
    if (context.selectedNote?.id !== note.id && isEditing) {
      exitEditing();
    }
  }, [context.selectedNote, isEditing, note.id]);

  const submitUpdate = async (newValue: string): Promise<void> => {
    try {
      await updateNote({
        variables: {
          id: note.id,
          input: {
            noteName: newValue,
          },
        },
      });
    } catch (e) {
      console.error('Error updating note:', e);
    }
  };

  return (
    <Draggable draggableId={note.id} index={index}>
      {(provided) => (
        <Box
          onContextMenu={(e) => handleContextMenu(e, note.id)}
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`${styles.note} ${
            context.selectedNote?.id === note.id ? styles.selected : ''
          }`}
          style={getItemStyle(provided.draggableProps.style, false, theme)}
          onClick={handleClick}
          onDoubleClick={handleDoubleClick}
        >
          {isEditing ? (
            <TextField
              variant={'standard'}
              type="text"
              value={value}
              onChange={handleChange}
              onBlur={handleBlur}
              onKeyDown={(e) => handleKeyDown(e, submitUpdate)}
              autoFocus
            />
          ) : (
            <Typography>{note.noteName}</Typography>
          )}
        </Box>
      )}
    </Draggable>
  );
};

export default NoteTreeItem;
