import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import { Droppable } from '@hello-pangea/dnd';
import { ProjectNoteType } from '@/app/graphql/resolvers/types';
import styles from './noteTree.module.scss';
import NoteTreeItem from '@/app/components/Notes/NoteTree/NoteTreeItem';
import { useProjectContext } from '@/app/contexts/ProjectContext';

interface RenderNoteTreeProps {
  handleContextMenu: (event: React.MouseEvent, noteId: string) => void;
}

const RenderNoteTree: React.FC<RenderNoteTreeProps> = ({
  handleContextMenu,
}) => {
  const { projects, selectedProject } = useProjectContext();
  const [localNotes, setLocalNotes] = useState<ProjectNoteType[]>([]);

  useEffect(() => {
    if (selectedProject?.notes) {
      const sortedNotes = [...selectedProject.notes].sort(
        (a, b) => a.position - b.position,
      );
      setLocalNotes(sortedNotes);
    } else {
      setLocalNotes([]);
    }
  }, [projects, selectedProject]);

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
