import React from 'react';
import styles from './sidebar.module.scss';
import { useProjectContext } from '../../contexts/ProjectContext';
import ProjectTree from '../ProjectTree';
import NoteTree from '@/app/components/NoteTree';
import { DragDropContext } from '@hello-pangea/dnd';
import { useLazyQuery, useMutation } from '@apollo/client';
import { GET_NOTE } from '@/app/graphql/queries/getNotes';
import {
  MOVE_NOTE_ORDER,
  MOVE_NOTE_TO_PROJECT,
} from '@/app/graphql/mutations/addNotes';

function Sidebar() {
  const context = useProjectContext();

  const [getNote, { data: noteData, loading: noteLoading, error: noteError }] =
    useLazyQuery(GET_NOTE);

  const [moveNoteToProject] = useMutation(MOVE_NOTE_TO_PROJECT);

  const [moveNotePosition] = useMutation(MOVE_NOTE_ORDER);

  if (!context.projects) return <p>Loading...</p>;

  async function handleDragEnd(result: {
    draggableId: any;
    destination: any;
    source: any;
  }) {
    const { draggableId, destination, source } = result;

    await getNote({
      variables: {
        id: draggableId,
      },
    });

    // Ensure that the destination exists (i.e., the item wasn't just dragged outside any droppable)
    if (!destination) return;

    // If it's the same list and the position hasn't changed, return early
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    // If moved to a different list (like a project)
    if (destination.droppableId !== source.droppableId) {
      const destinationProjectId = destination.droppableId.split('-')[1];
      console.log(
        `Note with ID ${draggableId} is going into project with ID ${destinationProjectId}.`,
      );

      console.log('Note: ' + noteData?.getNote);

      if (!noteData?.getNote) return;

      const result = await moveNoteToProject({
        variables: {
          noteId: noteData?.getNote.id,
          projectId: destinationProjectId,
        },
      });

      console.log('Result: ' + result);
    } else if (destination.droppableId === source.droppableId) {
      // If reordering within the same list
      console.log(
        `Note with ID ${draggableId} moved from position ${source.index} to ${destination.index}.`,
      );

      console.log('Index: ' + destination.index);

      const result = await moveNotePosition({
        variables: {
          noteId: draggableId,
          order: destination.index,
        },
      });

      console.log(result);
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
