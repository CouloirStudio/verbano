import React, {useEffect} from 'react';
import styles from './sidebar.module.scss';
import {useProjectContext} from '@/app/contexts/ProjectContext';
import ProjectTree from '@/app/components/Projects/ProjectTree';
import NoteTree from '@/app/components/Notes/NoteTree';
import {DragDropContext, DragStart, DropResult} from '@hello-pangea/dnd';
import {useLazyQuery, useMutation} from '@apollo/client';
import GetNote from '@/app/graphql/queries/GetNote';
import MoveNoteOrder from '@/app/graphql/mutations/MoveNoteOrder';
import MoveNoteToProject from '@/app/graphql/mutations/MoveNoteToProject';
import {NoteType, ProjectNoteType} from '@/app/graphql/resolvers/types';
import {useTheme} from '@mui/material/styles';
import {useNoteListContext} from '@/app/contexts/NoteListContext';
import {useDraggingContext} from '@/app/contexts/DraggingContext';

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
 * @param projectNotesArray - An array of project notes.
 */
function reorderPositions(projectNotesArray: ProjectNoteType[]): void {
  projectNotesArray.forEach((projectNote, index) => {
    // Update the position property of the note within each ProjectNoteType
    projectNote.position = index;
  });
}

/**
 * The Sidebar component handles the drag-and-drop logic for notes within and between projects.
 */
const Sidebar: React.FC = () => {
  const {
    projects,
    setProjects,
    selectedProject,
    setSelectedProject,
    refetchData,
  } = useProjectContext();
  const { setDraggingItemType, draggingItemType } = useDraggingContext();
  const { selectedNotes } = useNoteListContext();

  const [getNote, { data: noteData }] = useLazyQuery(GetNote);
  const [moveNoteToProject] = useMutation(MoveNoteToProject);
  const [moveNotePosition] = useMutation(MoveNoteOrder);

  const theme = useTheme();
  const sidebarBg = theme.custom?.moreContrastBackground ?? '';
  const textColour = theme.custom?.text ?? '';

  if (!projects) return <p>Loading...</p>;

  const handleDragStart = (result: DragStart) => {
    // Determine the item type from the result and set it in the context
    const itemType = result.draggableId.includes('note') ? 'note' : 'project';
    setDraggingItemType(itemType);
  };

  const handleDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (draggingItemType === 'project') {
      return;
    }

    try {
      const updatedProjects = [...projects];

      const formattedId = draggableId.split('-')[1];

      // Process all selected notes
      if (!selectedProject) {
        throw new Error('Selected project is missing.');
      }

      // The destination is in the projects note dropdown list, so we need to move the note to the project
      if (destination.droppableId.endsWith('-notes')) {
        const destinationProjectId = destination.droppableId.split('-')[1];

        await moveNoteToProject({
          variables: {
            noteId: formattedId,
            projectId: destinationProjectId,
          },
        });
      } else if (destination.droppableId === 'notes') {
        // Find the index of the project where the note is being moved
        const projectIndex = updatedProjects.findIndex(
          (p) => p.id === selectedProject.id,
        );
        if (projectIndex === -1) {
          console.error('Project not found.');
          return;
        }

        // Clone the notes array within the project
        const updatedNotes = [...updatedProjects[projectIndex].notes];

        // Find the original index of the note
        const originalIndex = updatedNotes.findIndex(
          (n) => n.note.id === formattedId,
        );
        if (originalIndex === -1) {
          console.error('Note not found.');
          return;
        }

        // Remove the note from its original position and insert it at the new position
        const [movedNote] = updatedNotes.splice(source.index, 1);
        updatedNotes.splice(destination.index, 0, movedNote);

        // Update the position property of each note based on its index in the array
        reorderPositions(updatedNotes);

        // Update the project's notes in the cloned projects array
        updatedProjects[projectIndex].notes = updatedNotes;

        // Update the projects array in the context
        setProjects(updatedProjects);
        // Update the selected project
        setSelectedProject(updatedProjects[projectIndex]);

        // Call the mutation to update the order in the backend
        moveNotePosition({
          variables: {
            noteId: formattedId,
            order: destination.index,
          },
        });
      }
    } catch (e) {
      console.error('Error moving note:', e);
    }
  };

  useEffect(() => {}, [projects]);

  return (
    <div
      className={styles.sidebar}
      style={{ backgroundColor: sidebarBg, color: textColour }}
    >
      <DragDropContext onDragEnd={handleDragEnd} onDragStart={handleDragStart}>
        <ProjectTree />

        <NoteTree />
      </DragDropContext>
    </div>
  );
};

export default Sidebar;
