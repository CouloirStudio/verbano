import React from 'react';
import styles from './sidebar.module.scss';
import { useProjectContext } from '@/app/contexts/ProjectContext';
import ProjectTree from '@/app/components/Projects/ProjectTree';
import NoteTree from '@/app/components/Notes/NoteTree';
import { DragDropContext, DropResult } from '@hello-pangea/dnd';
import { useLazyQuery, useMutation } from '@apollo/client';
import GetNote from '@/app/graphql/queries/GetNote';
import MoveNoteOrder from '@/app/graphql/mutations/MoveNoteOrder';
import MoveNoteToProject from '@/app/graphql/mutations/MoveNoteToProject';
import { NoteType, ProjectNoteType } from '@/app/graphql/resolvers/types';
import { useTheme } from '@mui/material/styles';
import { NoteListContextProvider } from '@/app/contexts/NoteListContext';

/**
 * Extends the basic NoteType with a position property.
 * This type is used for internal operations related to drag-and-drop functionality.
 */
interface ExtendedNoteType extends NoteType {
  position: number;
}

/**
 * Converts ProjectNoteType[] to ExtendedNoteType[].
 * @param projectNotes - An array of notes with their project-specific structure.
 * @returns An array of extended notes used for drag-and-drop operations.
 */
function projectNotesToExtendedNotes(
  projectNotes: ProjectNoteType[],
): ExtendedNoteType[] {
  return projectNotes.map(({ note, position }) => ({
    ...note,
    position: position,
  }));
}

/**
 * Converts ExtendedNoteType[] back to ProjectNoteType[] for consistency with GraphQL types.
 * @param extendedNotes - An array of extended notes.
 * @returns An array of notes with their project-specific structure.
 */
function extendedNotesToProjectNotes(
  extendedNotes: ExtendedNoteType[],
): ProjectNoteType[] {
  return extendedNotes.map((extendedNote) => ({
    note: {
      id: extendedNote.id,
      audioLocation: extendedNote.audioLocation,
      dateCreated: extendedNote.dateCreated,
      transcription: extendedNote.transcription,
      tags: extendedNote.tags,
      projectId: extendedNote.projectId,
      noteName: extendedNote.noteName,
      noteDescription: extendedNote.noteDescription,
    },
    position: extendedNote.position,
  }));
}

/**
 * Updates the position of each note based on its index in the array.
 * @param notesArray - An array of extended notes.
 */
function reorderPositions(notesArray: ExtendedNoteType[]): void {
  notesArray.forEach((note, index) => {
    note.position = index;
  });
}

/**
 * The Sidebar component handles the drag-and-drop logic for notes within and between projects.
 */
const Sidebar: React.FC = () => {
  const { projects, selectedProject, setSelectedProject, refetchData } =
    useProjectContext();

  const [getNote, { data: noteData }] = useLazyQuery(GetNote);
  const [moveNoteToProject] = useMutation(MoveNoteToProject);
  const [moveNotePosition] = useMutation(MoveNoteOrder);

  const theme = useTheme();
  const sidebarBg = theme.custom?.moreContrastBackground ?? '';
  const textColour = theme.custom?.text ?? '';

  if (!projects) return <p>Loading...</p>;

  const handleDragEnd = async (result: DropResult) => {
    const { draggableId, destination, source } = result;

    try {
      await getNote({
        variables: { id: draggableId },
      });

      if (!destination || !selectedProject) {
        throw new Error(
          'No destination specified or selected project is missing.',
        );
      }

      if (
        destination.droppableId === source.droppableId &&
        destination.index === source.index
      ) {
        return;
      }

      const notesCopy: ExtendedNoteType[] = projectNotesToExtendedNotes(
        selectedProject.notes,
      );

      if (destination.droppableId !== source.droppableId) {
        const destinationProjectId = destination.droppableId.split('-')[1];
        if (!noteData?.getNote) return;

        await moveNoteToProject({
          variables: {
            noteId: draggableId,
            projectId: destinationProjectId,
          },
        });
      } else {
        if (!noteData?.getNote) return;

        const [originalNote] = notesCopy.splice(source.index, 1);
        const movedNote = { ...originalNote, position: destination.index };
        notesCopy.splice(destination.index, 0, movedNote);

        reorderPositions(notesCopy);

        setSelectedProject({
          ...selectedProject,
          notes: extendedNotesToProjectNotes(notesCopy),
        });

        await moveNotePosition({
          variables: {
            noteId: draggableId,
            order: destination.index,
          },
        });
      }
      refetchData();
    } catch (error) {
      console.error('An error occurred during drag end:', error);
    }
  };

  return (
    <div
      className={styles.sidebar}
      style={{ backgroundColor: sidebarBg, color: textColour }}
    >
      <DragDropContext onDragEnd={handleDragEnd}>
        <ProjectTree />
        <NoteListContextProvider>
          <NoteTree />
        </NoteListContextProvider>
      </DragDropContext>
    </div>
  );
};

export default Sidebar;
