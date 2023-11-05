import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import { Draggable } from '@hello-pangea/dnd';
import { useTheme } from '@mui/material/styles';
import { useMutation } from '@apollo/client';
import UpdateNote from '@/app/graphql/mutations/UpdateNote.graphql';
import styles from './noteTree.module.scss';
import { NoteType } from '@/app/graphql/resolvers/types';
import { useProjectContext } from '@/app/contexts/ProjectContext';
import { useNoteListContext } from '@/app/contexts/NoteListContext';
import useDoubleClickEdit from '@/app/hooks/useDoubleClickEdit';
import useNoteSelection from '@/app/hooks/useNoteSelection';
import { getItemStyle } from '@/app/components/Notes/NoteTree/utilityFunctions';

interface NoteTreeItemProps {
  note: NoteType;
  index: number;
  handleContextMenu: (
    event: React.MouseEvent<HTMLDivElement>,
    noteId: string,
  ) => void;
}

const NoteTreeItem: React.FC<NoteTreeItemProps> = memo(
  ({ note, index, handleContextMenu }) => {
    const theme = useTheme();
    const { id, noteName } = note;
    const { selectedNote } = useProjectContext();
    const [updateNote] = useMutation(UpdateNote);
    const [name, setName] = useState<string>(noteName);
    const { selectedNotes } = useNoteListContext();
    const { handleClick, isSelected } = useNoteSelection(id);

    const {
      isEditing,
      value,
      handleChange,
      handleSubmit,
      handleDoubleClick,
      handleBlur,
      handleKeyDown,
      exitEditing,
    } = useDoubleClickEdit(noteName);

    useEffect(() => {
      if (selectedNote?.id !== id && isEditing) {
        exitEditing();
      }
    }, [selectedNote, isEditing, id, exitEditing]);

    const selectedStyle = useMemo(
      () => ({
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
      }),
      [theme.palette.primary],
    );

    const style = useMemo(
      () => ({
        ...getItemStyle(null, false, theme),
        ...(selectedNotes.includes(id) && selectedNote?.id !== id
          ? selectedStyle
          : {}),
      }),
      [selectedNotes, selectedNote, id, theme, selectedStyle],
    );
    // Function to submit the updated note name
    const submitUpdate = async (newValue: string): Promise<void> => {
      if (newValue === note.noteName) {
        setName(newValue);
        return;
      }
      if (newValue.trim() === '') {
        setName(note.noteName);
        return;
      }

      setName(newValue.trim());
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
        setName(note.noteName);
        console.error('Error updating note:', e);
      }
    };

    const handleContextMenuEvent = useCallback(
      (e: React.MouseEvent<HTMLDivElement>) => handleContextMenu(e, id),
      [handleContextMenu, id],
    );

    return (
      <Draggable key={note.id} draggableId={note.id} index={index}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
          >
            <Box
              onContextMenu={handleContextMenuEvent}
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              className={`${styles.note} ${
                selectedNote?.id === id ? styles.active : ''
              }`}
              style={style}
              onClick={handleClick}
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
                <Typography>{name}</Typography>
              )}
            </Box>
          </div>
        )}
      </Draggable>
    );
  },
  (prevProps, nextProps) =>
    prevProps.note.id === nextProps.note.id &&
    prevProps.note.noteName === nextProps.note.noteName &&
    prevProps.index === nextProps.index,
);

export default NoteTreeItem;
