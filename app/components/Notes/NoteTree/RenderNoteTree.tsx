import React from 'react';
import Box from '@mui/material/Box';
import { Droppable } from '@hello-pangea/dnd';
import styles from './noteTree.module.scss';
import NoteTreeItem from '@/app/components/Notes/NoteTree/NoteTreeItem';
import { ProjectNoteType, ProjectType } from '@/app/graphql/resolvers/types';

const renderNoteTree = (
  notes: ProjectNoteType[],
  handleContextMenu: {
    (event: React.MouseEvent<Element, MouseEvent>, noteId: string): void;
    (event: React.MouseEvent<HTMLDivElement, MouseEvent>, noteId: string): void;
  },
  selectedProject: ProjectType | null,
) => {
  const sortedNotes = [...notes].sort((a, b) => a.position - b.position);

  return (
    <Droppable droppableId="notes" type={'note'}>
      {(provided) => (
        <Box
          className={styles.noteList}
          ref={provided.innerRef}
          {...provided.droppableProps}
        >
          {sortedNotes.length > 0 ? (
            sortedNotes.map((note, index) => (
              <NoteTreeItem
                key={note.note.id}
                note={note.note}
                index={index}
                handleContextMenu={handleContextMenu}
              />
            ))
          ) : selectedProject && selectedProject.notes.length > 0 ? (
            <div className={styles.emptyState}>
              Create a new note to start transcribing!
            </div>
          ) : (
            <> </>
          )}
          {provided.placeholder}
        </Box>
      )}
    </Droppable>
  );
};

export default renderNoteTree;
