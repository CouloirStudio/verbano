import React from 'react';
import styles from './sidebar.module.scss';
import { useProjectContext } from '../../contexts/ProjectContext';
import ProjectTree from '../ProjectTree';
import NoteTree from '@/app/components/NoteTree';
import { DragDropContext, DropResult } from '@hello-pangea/dnd';
import { useLazyQuery, useMutation } from '@apollo/client';
import { GET_NOTE } from '@/app/graphql/queries/getNotes';
import {
  MOVE_NOTE_ORDER,
  MOVE_NOTE_TO_PROJECT,
} from '@/app/graphql/mutations/addNotes';

function reorderPositions(notesArray: string | any[]) {
  for (let i = 0; i < notesArray.length; i++) {
    notesArray[i].position = i;
  }
}

function Sidebar() {
  const context = useProjectContext();

  const [getNote, { data: noteData, loading: noteLoading, error: noteError }] =
    useLazyQuery(GET_NOTE);

  const [moveNoteToProject] = useMutation(MOVE_NOTE_TO_PROJECT);

  const [moveNotePosition] = useMutation(MOVE_NOTE_ORDER);

  if (!context.projects) return <p>Loading...</p>;

  async function handleDragEnd(result: DropResult) {
    const { draggableId, destination, source } = result;

    await getNote({
      variables: {
        id: draggableId,
      },
    });

    // Ensure that the destination exists (i.e., the item wasn't just dragged outside any droppable)
    if (!destination) return;

    if (!context || !context.selectedProject) return;

    // If it's the same list and the position hasn't changed, return early
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    let notes = [...context.selectedProject.notes];

    // If moved to a different list (like a project)
    if (destination.droppableId !== source.droppableId) {
      const destinationProjectId = destination.droppableId.split('-')[1];

      if (!noteData?.getNote) return;

      const result = await moveNoteToProject({
        variables: {
          noteId: draggableId,
          projectId: destinationProjectId,
        },
      });
    } else if (destination.droppableId === source.droppableId) {
      // If reordering within the same list

      if (!noteData?.getNote) return;

      // Extract notes from context
      const [movedNote] = notes.splice(source.index, 1);
      movedNote.position = destination.index;
      notes.splice(destination.index, 0, movedNote);

      reorderPositions(notes);

      context.setSelectedProject({
        ...context.selectedProject,
        notes,
      });

      const result = await moveNotePosition({
        variables: {
          noteId: draggableId,
          order: destination.index,
        },
      });
    }

    context.refetchData();
  }

  return (
    <div className={styles.sidebar}>
      <DragDropContext onDragEnd={handleDragEnd}>
        <ProjectTree />
        <NoteTree />
      </DragDropContext>
    </div>
  );
}

export default Sidebar;
