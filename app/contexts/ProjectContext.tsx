import React, { createContext, useContext, useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_PROJECTS_AND_NOTES } from '../graphql/queries/getNotes';
import { NoteType, ProjectType } from '../graphql/resolvers/types';
import { uploadAudio } from '../api/audio';
import client from '../config/apolloClient';

/**
 * Defines the shape of the ProjectContext.
 */
type ProjectContextType = {
  selectedNote: NoteType | null;
  setSelectedNote: (note: NoteType) => void;
  projects: ProjectType[];
  setProjects: (projects: ProjectType[]) => void;
  selectedProject: ProjectType | null;
  setSelectedProject: (project: ProjectType | null) => void;
  handleAudioUpload: (audioFile: Blob) => Promise<void>;
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
  const [projects, setProjects] = useState<ProjectType[]>([]);
  const [selectedProject, setSelectedProject] = useState<ProjectType | null>(
    null,
  );

  const { data, error, refetch } = useQuery<{ listProjects: ProjectType[] }>(
    GET_PROJECTS_AND_NOTES,
  );

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
          (project) => project.id === selectedProject.id,
        );

        if (
          JSON.stringify(updatedSelectedProject) !==
          JSON.stringify(selectedProject)
        ) {
          setSelectedProject(updatedSelectedProject || null);
        }
      }

      if (selectedNote) {
        const updatedSelectedNote = data.listProjects
          .find((project) => project.id === selectedProject?.id)
          ?.notes.find((note) => note.note.id === selectedNote.id);

        if (
          JSON.stringify(updatedSelectedNote) !== JSON.stringify(selectedNote)
        ) {
          if (updatedSelectedNote) setSelectedNote(updatedSelectedNote.note);
        }
      }
    }
  }, [data, selectedProject]);

  async function handleAudioUpload(audioFile: Blob) {
    try {
      const response = await uploadAudio(
        audioFile,
        'http://localhost:3000',
        selectedProject,
        selectedNote,
      );

      const { data: updatedData } = await client.readQuery({
        query: GET_PROJECTS_AND_NOTES,
      });
      if (updatedData && updatedData.listProjects) {
        setProjects(updatedData.listProjects);
      }
    } catch (error) {
      console.error('Error during audio upload:', error);
    }
  }

  return (
    <ProjectContext.Provider
      value={{
        selectedNote,
        setSelectedNote,
        projects,
        setProjects,
        selectedProject,
        setSelectedProject,
        handleAudioUpload,
        refetchData: refetchData,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};
