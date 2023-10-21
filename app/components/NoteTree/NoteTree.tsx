import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { useProjectContext } from '../../contexts/ProjectContext';
import { ProjectType } from '../../resolvers/types';
import NoteTreeHeader from '@/app/components/NoteTree/NoteTreeHeader';
import Typography from '@mui/material/Typography';
import styles from './noteTree.module.scss';

import { makeStyles } from '@mui/styles';

import {
  Draggable,
  Droppable,
  DroppableProvided,
  DroppableStateSnapshot,
} from '@hello-pangea/dnd';

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

const getItemStyle = (draggableStyle: any, isDragging: any) => ({
  userSelect: 'none',

  // change background colour if dragging
  background: isDragging ? 'lightgreen' : '',

  // styles we need to apply on draggables
  ...draggableStyle,
});

function NoteTree() {
  const classes = useStyles(); // Get the styles
  const { selectedProject, setSelectedNote, selectedNote } =
    useProjectContext();
  const [activeTab, setActiveTab] = useState(0);

  if (!selectedProject) return <p>Loading...</p>;

  const renderNoteTree = (project: ProjectType) => {
    // Sort notes based on their position
    const sortedNotes = [...project.notes].sort(
      (a, b) => a.position - b.position,
    );

    return (
      <>
        <Droppable droppableId="notes">
          {(provided: DroppableProvided, snapshot: DroppableStateSnapshot) => (
            <Box
              className={styles.noteList}
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {sortedNotes.map((projectNote, index: number) => (
                <Draggable
                  key={projectNote.note.id}
                  draggableId={projectNote.note.id}
                  index={index}
                >
                  {(provided) => (
                    <Box
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={`${styles.note} ${
                        selectedNote?.id === projectNote.note.id
                          ? styles.selected
                          : ''
                      }`}
                      style={getItemStyle(
                        provided.draggableProps.style,
                        snapshot.draggingOverWith === projectNote.note.id,
                      )}
                      onClick={() => setSelectedNote(projectNote.note)}
                    >
                      <Typography>{projectNote.note.noteName}</Typography>
                    </Box>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </Box>
          )}
        </Droppable>
      </>
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
        <Tab label="Reports" className={classes.tabItem} />
      </Tabs>

      {activeTab === 0 && (
        <>
          <NoteTreeHeader />
          {/*<ScrollView></ScrollView>*/}
          {renderNoteTree(selectedProject)}
        </>
      )}

      {activeTab === 1 && (
        // Render your project view content here
        <Box className={styles.reportList}></Box>
      )}
    </Box>
  );
}

export default NoteTree;
