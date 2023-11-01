import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import { Droppable } from '@hello-pangea/dnd';
import { ProjectNoteType, ProjectType } from '@/app/graphql/resolvers/types';
import styles from './noteTree.module.scss';
import { useTheme } from '@mui/material/styles';
import NoteTreeItem from '@/app/components/Notes/NoteTree/NoteTreeItem';
import { useProjectContext } from '@/app/contexts/ProjectContext';
import { useNoteListContext } from '@/app/contexts/NoteListContext';

interface RenderNoteTreeProps {
  project: ProjectType | null;
  handleContextMenu: (event: React.MouseEvent, noteId: string) => void;
}

const RenderNoteTree: React.FC<RenderNoteTreeProps> = ({
  project,
  handleContextMenu,
}) => {
  const theme = useTheme();
  const [localNotes, setLocalNotes] = useState<ProjectNoteType[]>([]);
  const { selectedNote, setSelectedNote } = useProjectContext();
  const { selectedNotes, setSelectedNotes } = useNoteListContext();

  useEffect(() => {
    if (project?.notes) {
      const sortedNotes = [...project.notes].sort(
        (a, b) => a.position - b.position,
      );
      setLocalNotes(sortedNotes);
    }
  }, [project]);

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
        setSelectedNote(activeNote);
      }
    }
  };

  return (
    <Droppable droppableId="notes">
      {(provided) => (
        <Box
          className={styles.noteList}
          ref={provided.innerRef}
          {...provided.droppableProps}
        >
          {localNotes.length > 0 ? (
            localNotes.map((note, index) => (
              <NoteTreeItem
                key={note.note.id}
                note={note.note}
                index={index}
                active={selectedNote?.id === note.note.id}
                selected={selectedNotes.includes(note.note.id)}
                handleContextMenu={handleContextMenu}
              />
            ))
          ) : (
            <div className={styles.emptyState}>
              Create a new note to start transcribing!
            </div>
          )}
          {provided.placeholder}
        </Box>
      )}
    </Droppable>
  );
};

export default RenderNoteTree;
