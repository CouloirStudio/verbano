import React from 'react';
import styles from './sidebar.module.scss';
import {useProjectContext} from '@/app/contexts/ProjectContext';
import ProjectTree from '@/app/components/Projects/ProjectTree';
import NoteTree from '@/app/components/Notes/NoteTree';
import {DragDropContext} from '@hello-pangea/dnd';
import {NoteType, ProjectNoteType} from '@/app/graphql/resolvers/types';
import {useTheme} from '@mui/material/styles';
import {NoteListContextProvider} from '@/app/contexts/NoteListContext';
import {useDragAndDrop} from '@/app/hooks/useDragAndDrop';

/**
 * Extends the basic NoteType with a position property.
 * This type is used for internal operations related to drag-and-drop functionality.
 */
interface ExtendedNoteType extends NoteType {
  position: number;
}

type HasPosition = {
  position: number;
};

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
 * Updates the position of each item based on its index in the array.
 * @param itemsArray - An array of items with a position property.
 */
function reorderPositions<T extends HasPosition>(itemsArray: T[]): void {
  itemsArray.forEach((item, index) => {
    item.position = index;
  });
}

/**
 * The Sidebar component handles the drag-and-drop logic for notes within and between projects.
 */
const Sidebar: React.FC = () => {
  const {
    projects,
    selectedProject,
    setProjects,
    setSelectedProject,
    refetchData,
  } = useProjectContext();

  const theme = useTheme();
  const sidebarBg = theme.custom?.moreContrastBackground ?? '';
  const textColour = theme.custom?.text ?? '';

  if (!projects) return <p>Loading...</p>;

  const { handleDragEnd } = useDragAndDrop({
    projects,
    setProjects,
    setSelectedProject,
    selectedProject,
    refetchData,
  });

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
