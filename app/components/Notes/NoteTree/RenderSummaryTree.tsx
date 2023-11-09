import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import { Droppable } from '@hello-pangea/dnd';
import styles from './noteTree.module.scss';
import { useProjectContext } from '@/app/contexts/ProjectContext';
import { ProjectSummaryType } from '@/app/graphql/resolvers/types';
import SummaryTreeItem from '@/app/components/Notes/NoteTree/SummaryTreeItem';

interface RenderNoteTreeProps {
  handleContextMenu: (event: React.MouseEvent, noteId: string) => void;
}

const RenderNoteTree: React.FC<RenderNoteTreeProps> = ({
  handleContextMenu,
}) => {
  const { projects, selectedProject, setSelectedProject } = useProjectContext();

  const [localSummaries, setLocalSumarries] = useState<ProjectSummaryType[]>(
    [],
  );

  useEffect(() => {
    if (selectedProject) {
      setLocalSumarries(
        [...selectedProject.summaries].sort((a, b) => a.position - b.position),
      );
    }
  }, [selectedProject]);

  return (
    <Droppable droppableId="summaries" type={'summary'}>
      {(provided) => (
        <Box
          className={styles.noteList}
          ref={provided.innerRef}
          {...provided.droppableProps}
        >
          {localSummaries.length > 0 ? (
            localSummaries.map((summary, index) => (
              <SummaryTreeItem
                key={summary.summary.id}
                summary={summary.summary}
                index={index}
                handleContextMenu={handleContextMenu}
              />
            ))
          ) : (
            <div className={styles.emptyState}>
              Create a new note to start transcribing!
            </div>
          )}
          {provided.placeholder}
        </Box>
      )}
    </Droppable>
  );
};

export default RenderNoteTree;
