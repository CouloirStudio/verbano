import { useLazyQuery, useMutation } from '@apollo/client';
import { useCallback } from 'react';
import { DropResult } from '@hello-pangea/dnd';
import { ExtendedNoteType, ProjectType } from '@/app/types'; // Import your type definitions here
import GetNote from '@/app/graphql/queries/GetNote.graphql';
import MoveNoteOrder from '@/app/graphql/mutations/MoveNoteOrder.graphql';
import MoveProjectOrder from '@/app/graphql/mutations/MoveProjectOrder.graphql';
import MoveNoteToProject from '@/app/graphql/mutations/MoveNoteToProject.graphql';
import { ProjectNoteType } from '@/app/graphql/resolvers/types';

interface UseDragAndDropParams {
  projects: ProjectType[];
  setProjects: (projects: ProjectType[]) => void;
  selectedProject: ProjectType;
  setSelectedProject: (project: ProjectType) => void;
  refetchData: () => void;
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

interface HasPosition {
  position: number;
}

export const useDragAndDrop = ({
  projects,
  setProjects,
  setSelectedProject,
  selectedProject,
  refetchData,
}: UseDragAndDropParams) => {
  const [getNote, { data: noteData }] = useLazyQuery(GetNote);

  const [moveNoteToProject] = useMutation(MoveNoteToProject);
  const [moveNotePosition] = useMutation(MoveNoteOrder);
  const [moveProjectOrder] = useMutation(MoveProjectOrder);

  const handleDragEnd = useCallback(
    async (result: DropResult) => {
      const { draggableId, destination, source } = result;

      if (!draggableId) return;

      if (!source) return;

      const formattedDraggableId = draggableId.split('-')[1];

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
        await getNote({
          variables: { id: formattedDraggableId },
        });

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

        const notesCopy: ExtendedNoteType[] = projectNotesToExtendedNotes(
          selectedProject.notes,
        );

        if (destination.droppableId !== source.droppableId) {
          const destinationProjectId = destination.droppableId.split('-')[1];
          if (!noteData?.getNote) return;

          await moveNoteToProject({
            variables: {
              noteId: formattedDraggableId,
              projectId: destinationProjectId,
            },
          });
        } else {
          if (!noteData?.getNote) return;

          const [originalNote] = notesCopy.splice(source.index, 1);
          const movedNote = { ...originalNote, position: destination.index };
          notesCopy.splice(destination.index, 0, movedNote);

          reorderPositions(notesCopy);

          const updatedProject = {
            ...selectedProject,
            notes: extendedNotesToProjectNotes(notesCopy),
          };

          selectedProject.notes = extendedNotesToProjectNotes(notesCopy);

          setProjects(
            projects.map((project) => {
              if (project.id === updatedProject.id) {
                return updatedProject;
              }
              return project;
            }),
          );

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
