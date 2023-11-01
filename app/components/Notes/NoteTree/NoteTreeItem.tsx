import React, {
  memo,
  PropsWithChildren,
  useCallback,
  useEffect,
  useState,
} from 'react';
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
import UpdateNote from '@/app/graphql/mutations/UpdateNote.graphql';
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
  const { id, noteName } = note;
  const theme = useTheme();
  const context = useProjectContext();
  const [updateNote] = useMutation(UpdateNote);

  // State for editing the note name
  const [name, setName] = useState(noteName);

  // Function to handle click events on the note item
  const handleClick = useCallback(() => {
    if (context.selectedNote?.id !== id) {
      context.setSelectedNote(note);
    }
  }, [id, name, context]);

  // Custom hook to manage double click editing
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

  // Cancel editing if the selected note changes
  useEffect(() => {
    if (context.selectedNote?.id !== note.id && isEditing) {
      exitEditing();
    }
  }, [context.selectedNote, isEditing, note.id, exitEditing]);

  // Function to submit the updated note name
  const submitUpdate = async (newValue: string): Promise<void> => {
    setName(newValue);
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
            <Typography>{name}</Typography>
          )}
        </Box>
      )}
    </Draggable>
  );
};

function areEqual(
  prevProps: PropsWithChildren<NoteTreeItemProps>,
  nextProps: PropsWithChildren<NoteTreeItemProps>,
) {
  return (
    prevProps.note.id === nextProps.note.id &&
    prevProps.note.noteName === nextProps.note.noteName &&
    prevProps.index === nextProps.index
  );
}

export default memo(NoteTreeItem, areEqual);