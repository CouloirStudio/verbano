import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { useProjectContext } from '../../contexts/ProjectContext';
import { NoteType } from '../../resolvers/types';
import NoteTreeHeader from '@/app/components/NoteTree/NoteTreeHeader';
import Typography from '@mui/material/Typography';
import styles from './noteTree.module.scss';

import { makeStyles } from '@mui/styles';

import { Draggable, Droppable } from '@hello-pangea/dnd';

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
    console.log(selectedProject);

    return (
      <Droppable droppableId="notes">
        {(provided) => (
          <Box
            className={styles.noteList}
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {notes?.map((note: NoteType, index: number) => (
              <Draggable key={note.id} draggableId={note.id} index={index}>
                {(provided) => (
                  <Box
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    key={note.id}
                    className={`${styles.note} ${
                      selectedNote?.id === note.id ? styles.selected : ''
                    }`}
                    onClick={() => setSelectedNote(note)}
                  >
                    <Typography>{note.noteName}</Typography>
                  </Box>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </Box>
        )}
      </Droppable>
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
          {/*<ScrollView></ScrollView>*/}
          {renderNoteTree(selectedProject?.notes)}
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
