import React from 'react';
import Box from '@mui/material/Box';
import { useProjectContext } from '../../contexts/ProjectContext';
import { NoteType } from '../../resolvers/types';
import NoteTreeHeader from '@/app/components/NoteTree/NoteTreeHeader';
import { Button } from '@mui/material';
import styles from './noteTree.module.scss';
import Typography from '@mui/material/Typography';

function NoteTree() {
  const { selectedProject, setSelectedNote, selectedNote } =
    useProjectContext();

  const renderNoteTree = (notes?: NoteType[]) => {
    return notes?.map((note: NoteType) => (
      <Button
        key={note.id}
        className={`${styles.note} ${
          selectedNote?.id === note.id && styles.selected
        }`}
        onClick={() => setSelectedNote(note)}
      >
        <Typography>{note.noteName}</Typography>
      </Button>
    ));
  };

  return (
    <Box
      className={styles.noteList}
      sx={{ minHeight: 180, flexGrow: 1, maxWidth: 300 }}
    >
      <NoteTreeHeader />
      {renderNoteTree(selectedProject?.notes)}
    </Box>
  );
}

export default NoteTree;
