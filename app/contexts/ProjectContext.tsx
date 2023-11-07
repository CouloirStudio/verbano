import React, {createContext, useContext, useEffect, useState} from 'react';
import {useQuery} from '@apollo/client';
import GetProjectsAndNotes from '@/app/graphql/queries/GetProjectsAndNotes.graphql';
import {NoteType, PositionedProjectType, ProjectType,} from '@/app/graphql/resolvers/types';

/**
 * Defines the shape of the ProjectContext.
 */
type ProjectContextType = {
  selectedNote: NoteType | null;
  setSelectedNote: (note: NoteType | null) => void;
  projects: PositionedProjectType[];
  setProjects: (projects: PositionedProjectType[]) => void;
  selectedProject: ProjectType | null;
  setSelectedProject: (project: ProjectType | null) => void;
  refetchData: () => void;
};

/**
 * Props for the ProjectProvider component.
 */
type ProjectProviderProps = {
  children: React.ReactNode;
};

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

/**
 * A custom hook to access the ProjectContext and ensure it's used within the ProjectProvider.
 */
export const useProjectContext = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProjectContext must be used within a ProjectProvider');
  }
  return context;
};

/**
 * Provides the ProjectContext to child components.
 */
export const ProjectProvider: React.FC<ProjectProviderProps> = ({
  children,
}) => {
  const [selectedNote, setSelectedNote] = useState<NoteType | null>(null);
  const [projects, setProjects] = useState<PositionedProjectType[]>([]);
  const [selectedProject, setSelectedProject] = useState<ProjectType | null>(
    null,
  );

  const { data, error, refetch } = useQuery<{
    listProjects: PositionedProjectType[];
  }>(GetProjectsAndNotes);

  async function refetchData() {
    try {
      const { data: refetchedData } = await refetch();
      if (refetchedData && refetchedData.listProjects) {
        setProjects(refetchedData.listProjects);
      }
    } catch (error) {
      console.error('Error during refetch:', error);
    }
  }

  if (error) console.error(error);

  useEffect(() => {
    if (data && data.listProjects) {
      setProjects(data.listProjects);

      if (selectedProject) {
        const updatedSelectedProject = data.listProjects.find(
          (project) => project.project.id === selectedProject.id,
        );

        if (
          JSON.stringify(updatedSelectedProject) !==
          JSON.stringify(selectedProject)
        ) {
          setSelectedProject(updatedSelectedProject?.project || null);
        }
      }

      if (selectedNote) {
        const updatedSelectedNote = data.listProjects
          .flatMap((project) => project.project.notes)
          .find((notePosition) => notePosition.note.id === selectedNote.id);

        if (
          JSON.stringify(updatedSelectedNote) !== JSON.stringify(selectedNote)
        ) {
          setSelectedNote(updatedSelectedNote?.note || null);
        }
      }
    }
  }, [data, selectedProject]);

  return (
    <ProjectContext.Provider
      value={{
        selectedNote,
        setSelectedNote,
        projects,
        setProjects,
        selectedProject,
        setSelectedProject,
        refetchData: refetchData,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};
