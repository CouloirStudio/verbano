import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import { Droppable } from '@hello-pangea/dnd';
import { ProjectNoteType, ProjectType } from '@/app/graphql/resolvers/types';
import styles from './noteTree.module.scss';
import { useTheme } from '@mui/material/styles';
import NoteTreeItem from '@/app/components/Notes/NoteTree/NoteTreeItem';

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

  useEffect(() => {
    if (project?.notes) {
      const sortedNotes = [...project.notes].sort(
        (a, b) => a.position - b.position,
      );
      setLocalNotes(sortedNotes);
    }
  }, [project]);

  return (
    <Droppable droppableId="notes">
      {(provided) => (
        <Box
          className={styles.noteList}
          ref={provided.innerRef}
          {...provided.droppableProps}
        >
          {localNotes.map((note, index) => (
            <NoteTreeItem
              key={note.note.id}
              note={note.note}
              index={index}
              handleContextMenu={handleContextMenu}
            />
          ))}
          {provided.placeholder}
        </Box>
      )}
    </Droppable>
  );
};

export default RenderNoteTree;
