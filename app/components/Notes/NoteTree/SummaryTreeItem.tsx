import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import { Draggable } from '@hello-pangea/dnd';
import { useTheme } from '@mui/material/styles';
import { useMutation } from '@apollo/client';
import UpdateNote from '@/app/graphql/mutations/UpdateNote.graphql';
import styles from './noteTree.module.scss';
import { SummaryType } from '@/app/graphql/resolvers/types';
import { useProjectContext } from '@/app/contexts/ProjectContext';
import { useNoteListContext } from '@/app/contexts/NoteListContext';
import useDoubleClickEdit from '@/app/hooks/useDoubleClickEdit';
import useNoteSelection from '@/app/hooks/useNoteSelection';
import { getItemStyle } from '@/app/components/Notes/NoteTree/utilityFunctions';

interface SummaryTreeItemProps {
  summary: SummaryType;
  index: number;
  handleContextMenu: (
    event: React.MouseEvent<HTMLDivElement>,
    noteId: string,
  ) => void;
}

const SummaryTreeItem: React.FC<SummaryTreeItemProps> = memo(
  ({ summary: summary, index, handleContextMenu }) => {
    const theme = useTheme();
    const { id, summaryName } = summary;
    const { selectedNote } = useProjectContext();
    const [updateNote] = useMutation(UpdateNote);
    const [name, setName] = useState<string>(summaryName);
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
    } = useDoubleClickEdit(summaryName);

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
      if (newValue === summary.summaryName) {
        setName(newValue);
        return;
      }
      if (newValue.trim() === '') {
        setName(summary.summaryName);
        return;
      }

      setName(newValue.trim());
      try {
        await updateNote({
          variables: {
            id: summary.id,
            input: {
              noteName: newValue,
            },
          },
        });
      } catch (e) {
        setName(summary.summaryName);
        console.error('Error updating note:', e);
      }
    };

    const handleContextMenuEvent = useCallback(
      (e: React.MouseEvent<HTMLDivElement>) => handleContextMenu(e, id),
      [handleContextMenu, id],
    );

    return (
      <Draggable
        key={'summary-' + summary.id}
        draggableId={'summary-' + summary.id}
        index={index}
      >
        {(provided) => {
          return (
            <Box
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              onContextMenu={handleContextMenuEvent}
              className={`${styles.note} ${
                selectedNote?.id === id ? styles.active : ''
              }`}
              style={{ ...provided.draggableProps.style, ...style }}
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
          );
        }}
      </Draggable>
    );
  },
  (prevProps, nextProps) =>
    prevProps.summary.id === nextProps.summary.id &&
    prevProps.summary.summaryName === nextProps.summary.summaryName &&
    prevProps.index === nextProps.index,
);

export default SummaryTreeItem;
