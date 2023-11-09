import React, { useState } from 'react';
import Box from '@mui/material/Box';
import { useProjectContext } from '@/app/contexts/ProjectContext';
import NoteTreeHeader from '@/app/components/Notes/NoteTree/NoteTreeHeader';
import styles from './noteTree.module.scss';
import { useTheme } from '@mui/material/styles';
import { ContextMenuComponent } from '@/app/components/UI/ContextMenu';
import RenderNoteTree from './RenderNoteTree';
import NoteTabs from './NoteTabs';
import { useNoteContextMenu } from '@/app/hooks/useNoteContextMenu';
import { useNoteListContext } from '@/app/contexts/NoteListContext';
import RenderSummaryTree from '@/app/components/Notes/NoteTree/RenderSummaryTree';

function NoteTree() {
  const [activeTab, setActiveTab] = useState(0);

  const theme = useTheme();
  const context = useProjectContext();

  const { contextMenu, handleContextMenu, handleClose, handleDelete } =
    useNoteContextMenu();

  const { selectedNotes, setSelectedNotes, clearSelectedNotes } =
    useNoteListContext();

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
          <RenderNoteTree handleContextMenu={handleContextMenu} />
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
