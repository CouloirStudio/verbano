import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { useProjectContext } from '../../contexts/ProjectContext';
import { NoteType } from '../../resolvers/types';
import NoteTreeHeader from '@/app/components/NoteTree/NoteTreeHeader';
import { Button } from '@mui/material';
import Typography from '@mui/material/Typography';
import styles from './noteTree.module.scss';

import { makeStyles } from '@mui/styles';
import ScrollView from '@/app/components/ScrollView';

const useStyles = makeStyles((theme) => ({
  tabsContainer: {
    backgroundColor: '#E0E0E0',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    alignContent: 'space-between',
  },

  tabItem: {
    cursor: 'pointer',
    fontSize: '0.875rem',
    fontWeight: 600,
    width: '50%',
    padding: '3px 5px',
    margin: '6px',
    border: 'none',
    borderRadius: '12px',
    display: 'flex',
    justifyContent: 'center',

    color: 'black',
    '&.Mui-selected': {
      backgroundColor: 'white',
      borderRadius: '15px',
    },
  },
}));

function NoteTree() {
  const classes = useStyles(); // Get the styles
  const { selectedProject, setSelectedNote, selectedNote } =
    useProjectContext();
  const [activeTab, setActiveTab] = useState(0);

  const renderNoteTree = (notes?: NoteType[]) => {
    return (
      <Box className={styles.noteList}>
        {notes?.map((note: NoteType) => (
          <Button
            key={note.id}
            className={`${styles.note} ${
              selectedNote?.id === note.id ? styles.selected : ''
            }`}
            onClick={() => setSelectedNote(note)}
          >
            <Typography>{note.noteName}</Typography>
          </Button>
        ))}
      </Box>
    );
  };

  return (
    <Box className={styles.section}>
      <Tabs
        value={activeTab}
        onChange={(event, newValue) => setActiveTab(newValue)}
        className={classes.tabsContainer}
        TabIndicatorProps={{ style: { display: 'none' } }}
      >
        <Tab label="Notes" className={classes.tabItem} />
        <Tab label="Projects" className={classes.tabItem} />
      </Tabs>

      {activeTab === 0 && (
        <>
          <NoteTreeHeader />
          <ScrollView>{renderNoteTree(selectedProject?.notes)}</ScrollView>
        </>
      )}

      {activeTab === 1 && (
        // Render your project view content here
        <Box className={styles.projectList}></Box>
      )}
    </Box>
  );
}

export default NoteTree;
