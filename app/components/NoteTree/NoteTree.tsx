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
import { ContextMenuComponent } from '@/app/components/ContextMenu';
import { DELETE_NOTE } from '@/app/graphql/mutations/addNotes';
import { useMutation } from '@apollo/client';

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
  const context = useProjectContext();
  const [activeTab, setActiveTab] = useState(0);

  const [contextMenu, setContextMenu] = useState<{
    mouseX: number;
    mouseY: number;
  } | null>(null);

  const handleContextMenu = (event: React.MouseEvent, noteId: string) => {
    event.preventDefault();
    setContextMenu({
      mouseX: event.clientX + 2,
      mouseY: event.clientY - 6,
    });
    setRightClickedNoteId(noteId);
  };

  const [rightClickedNoteId, setRightClickedNoteId] = useState<string | null>(
    null,
  );
  const handleClose = () => {
    setContextMenu(null);
  };
  const [deleteNote, { loading, error }] = useMutation(DELETE_NOTE);

  const handleDelete = async () => {
    try {
      const response = await deleteNote({
        variables: { id: rightClickedNoteId },
      });

      if (response.data.deleteNote) {
        console.log('Note successfully deleted!');
        // You can also refresh your notes list or handle UI updates here
      } else {
        console.error('Failed to delete the note.');
      }

      handleClose(); // Close the context menu after action
      context.refetchData(); // Refetch the data to update the UI
    } catch (err) {
      console.error('Error while deleting the note:', err.message);
    }
  };

  const renderNoteTree = (project?: ProjectType | null) => {
    // Sort notes based on their position
    const sortedNotes =
      project && [...project.notes].sort((a, b) => a.position - b.position);

    return (
      <>
        <Droppable droppableId="notes">
          {(provided: DroppableProvided, snapshot: DroppableStateSnapshot) => (
            <Box
              className={styles.noteList}
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {sortedNotes?.map((projectNote, index: number) => (
                <Draggable
                  key={projectNote.note.id}
                  draggableId={projectNote.note.id}
                  index={index}
                >
                  {(provided) => (
                    <Box
                      onContextMenu={(e) =>
                        handleContextMenu(e, projectNote.note.id)
                      }
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={`${styles.note} ${
                        context.selectedNote?.id === projectNote.note.id
                          ? styles.selected
                          : ''
                      }`}
                      style={getItemStyle(
                        provided.draggableProps.style,
                        snapshot.draggingOverWith === projectNote.note.id,
                      )}
                      onClick={() => context.setSelectedNote(projectNote.note)}
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
          {renderNoteTree(context.selectedProject)}
        </>
      )}

      {activeTab === 1 && (
        // Render your project view content here
        <Box className={styles.reportList}></Box>
      )}
      <ContextMenuComponent
        contextMenu={contextMenu}
        handleClose={handleClose}
        options={[
          {
            label: 'Edit',
            action: () => console.log('Edit clicked'),
          },
          {
            label: 'Delete',
            action: handleDelete,
          },
        ]}
      />
    </Box>
  );
}

export default NoteTree;
