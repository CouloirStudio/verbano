import React, { createContext, useContext, useState } from 'react';

type ProjectContextType = {
  selectedNotes: React.ReactNode[];
  setSelectedNotes: (notes: React.ReactNode[]) => void;
};

type ProjectProviderProps = {
  children: React.ReactNode;
};

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const useProjectContext = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProjectContext must be used within a ProjectProvider');
  }
  return context;
};

export const ProjectProvider: React.FC<ProjectProviderProps> = ({
  children,
}) => {
  const [selectedNotes, setSelectedNotes] = useState<React.ReactNode[]>([]);
  return (
    <ProjectContext.Provider value={{ selectedNotes, setSelectedNotes }}>
      {children}
    </ProjectContext.Provider>
  );
};
