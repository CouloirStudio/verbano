import { useLazyQuery, useMutation } from '@apollo/client';
import { useCallback } from 'react';
import { DropResult } from '@hello-pangea/dnd';
import GetNote from '@/app/graphql/queries/GetNote.graphql';
import MoveNoteOrder from '@/app/graphql/mutations/MoveNoteOrder.graphql';
import MoveProjectOrder from '@/app/graphql/mutations/MoveProjectOrder.graphql';
import MoveNoteToProject from '@/app/graphql/mutations/MoveNoteToProject.graphql';
import { NoteType, ProjectNoteType } from '@/app/graphql/resolvers/types';
import client from '@/app/config/apolloClient';
import { useProjectContext } from '@/app/contexts/ProjectContext';

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

function reorderPositions<T extends HasPosition>(itemsArray: T[]): void {
  itemsArray.forEach((item, index) => {
    item.position = index;
  });
}

/**
 * Interface representing items with a position property.
 */
interface HasPosition {
  position: number;
}

/**
 * A hook that provides drag and drop functionality for projects and notes.
 * It handles the reordering of projects and notes within and across projects.
 *
 * @param params - The UseDragAndDropParams object containing projects, setProjects, selectedProject, setSelectedProject, and refetchData.
 * @returns An object with a handleDragEnd function to be called when a drag operation ends.
 */
export const useDragAndDrop = () => {
  const [getNote, { data: noteData }] = useLazyQuery(GetNote);

  const [moveNoteToProject] = useMutation(MoveNoteToProject);
  const [moveNotePosition] = useMutation(MoveNoteOrder);
  const [moveProjectOrder] = useMutation(MoveProjectOrder);

  const {
    projects,
    setProjects,
    selectedProject,
    setSelectedProject,
    refetchData,
  } = useProjectContext();

  /**
   * Function to be called when a drag operation ends. It handles the logic for reordering
   * projects or moving notes between projects, and updates the local state as well as
   * the remote database via GraphQL mutations.
   *
   * @param result - The result object from the drag operation containing draggableId, source, and destination.
   */
  const handleDragEnd = useCallback(
    async (result: DropResult) => {
      const { draggableId, destination, source } = result;

      if (!draggableId) return;

      if (!source) return;

      const formattedDraggableId = draggableId.split('-')[1];

      // If the draggableId starts with 'project-', it is a project, and we need to reorder projects
      if (
        draggableId.startsWith('project-') &&
        destination?.droppableId === 'projects'
      ) {
        try {
          //update the project position in state
          const projectsCopy = [...projects];
          const [originalProject] = projectsCopy.splice(source.index, 1);
          const movedProject = {
            ...originalProject,
            position: destination.index,
          };
          projectsCopy.splice(destination.index, 0, movedProject);
          reorderPositions(projectsCopy);

          setProjects(projectsCopy);

          await moveProjectOrder({
            variables: {
              projectId: formattedDraggableId,
              order: destination.index,
            },
          });

          refetchData();
        } catch (error) {
          console.error('An error occurred during drag end:', error);
        }
        return;
      }

      try {
        const { data } = await client.query({
          query: GetNote,
          variables: { id: formattedDraggableId },
        });

        if (!data) return;

        if (!destination) {
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

        if (!selectedProject) return;

        const notesCopy: ExtendedNoteType[] = projectNotesToExtendedNotes(
          selectedProject.notes,
        );

        if (destination.droppableId !== source.droppableId) {
          const destinationProjectId = destination.droppableId.split('-')[1];

          await moveNoteToProject({
            variables: {
              noteId: formattedDraggableId,
              projectId: destinationProjectId,
            },
          });
        } else {
          const [originalNote] = notesCopy.splice(source.index, 1);
          const movedNote = { ...originalNote, position: destination.index };
          notesCopy.splice(destination.index, 0, movedNote);

          reorderPositions(notesCopy);

          const updatedProject = {
            ...selectedProject,
            notes: extendedNotesToProjectNotes(notesCopy),
          };

          setProjects(
            projects.map((project) => {
              if (project.project.id === updatedProject.id) {
                return {
                  ...project,
                  project: {
                    ...project.project,
                    notes: extendedNotesToProjectNotes(notesCopy),
                  },
                  position: project.position,
                };
              }
              return project;
            }),
          );

          const updatedSelectedProject = {
            ...selectedProject,
            notes: extendedNotesToProjectNotes(notesCopy),
          };
          setSelectedProject(updatedSelectedProject);

          await moveNotePosition({
            variables: {
              noteId: formattedDraggableId,
              order: destination.index,
            },
          });
        }
        refetchData();
      } catch (error) {
        console.error('An error occurred during drag end:', error);
      }
    },
    [
      projects,
      setProjects,
      setSelectedProject,
      selectedProject,
      refetchData,
      getNote,
      moveNoteToProject,
      moveNotePosition,
      moveProjectOrder,
    ],
  );

  return {
    handleDragEnd,
  };
};
