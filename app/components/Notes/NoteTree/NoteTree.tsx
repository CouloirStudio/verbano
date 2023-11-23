import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import { useProjectContext } from '@/app/contexts/ProjectContext';
import NoteTreeHeader from '@/app/components/Notes/NoteTree/NoteTreeHeader';
import styles from './noteTree.module.scss';
import { useTheme } from '@mui/material/styles';
import { ContextMenuComponent } from '@/app/components/UI/ContextMenu';
import renderNoteTree from './RenderNoteTree';
import NoteTabs from './NoteTabs';
import { useNoteContextMenu } from '@/app/hooks/useNoteContextMenu';
import { useNoteListContext } from '@/app/contexts/NoteListContext';
import RenderSummaryTree from '@/app/components/Notes/NoteTree/RenderSummaryTree';
import { ProjectNoteType } from '@/app/graphql/resolvers/types';

function NoteTree() {
  const [activeTab, setActiveTab] = useState(0);

  const theme = useTheme();
  const { selectedProject, projects, setSelectedNote } = useProjectContext();

  const { contextMenu, handleContextMenu, handleClose, handleDelete } =
    useNoteContextMenu();

  const { selectedNotes, setSelectedNotes, clearSelectedNotes } =
    useNoteListContext();

  const [localNotes, setLocalNotes] = useState<ProjectNoteType[]>([]);

  useEffect(() => {
    if (selectedProject) {
      setLocalNotes(
        [...selectedProject.notes].sort((a, b) => a.position - b.position),
      );
    }
  }, [selectedProject, projects]);

  useEffect(() => {
    renderNoteTree(localNotes, handleContextMenu, selectedProject);
  }, [projects]);

  return (
    <Box
      className={styles.section}
      style={{ backgroundColor: theme.custom?.contrastBackground }}
    >
      <NoteTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      {activeTab === 0 && (
        <>
          <NoteTreeHeader
            clearSelectedNotes={clearSelectedNotes}
            selectedNotes={selectedNotes}
          />
          {renderNoteTree(localNotes, handleContextMenu, selectedProject)}
        </>
      )}

      {activeTab === 1 && (
        <Box className={styles.reportList}>
          <>
            <RenderSummaryTree handleContextMenu={handleContextMenu} />
          </>
        </Box>
      )}

      <ContextMenuComponent
        contextMenu={contextMenu}
        handleClose={handleClose}
        options={[
          { label: 'Edit', action: () => console.log('Edit clicked') },
          { label: 'Delete', action: handleDelete },
        ]}
      />
    </Box>
  );
}

export default NoteTree;
