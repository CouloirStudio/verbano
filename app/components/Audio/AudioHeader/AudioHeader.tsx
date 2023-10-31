import React, { useEffect, useState } from 'react';
import { useProjectContext } from '@/app/contexts/ProjectContext';
import Box from '@mui/material/Box';
import styles from './audio.module.scss';
import Recorder from '@/app/components/Audio/Recorder';
import { Playback } from '@/app/components/Audio/Playback';
import { TranscriptionButton } from '@/app/components/Audio/Transcription';
import { useNoteContext } from '@/app/contexts/NoteContext';
import { useTheme } from '@mui/material/styles';

const AudioHeader = () => {
  const { selectedNote } = useProjectContext();
  const { refreshNoteDetails } = useNoteContext();
  const [hasRecording, setHasRecording] = useState(false);
  const theme = useTheme();

  // add function to do proper checking for audio location with error handling, then modify to be a proper functional component

  useEffect(() => {
    setHasRecording(!!(selectedNote && selectedNote.audioLocation));
  }, [selectedNote, refreshNoteDetails]);

  return (
    <Box
      className={styles.AudioContainer}
      sx={{
        color: theme.custom?.text,
        backgroundColor: theme.custom?.mainBackground,
      }}
    >
      {!hasRecording ? (
        <Recorder refreshNoteDetails={refreshNoteDetails} />
      ) : (
        <Playback baseUrl="http://localhost:3000" />
      )}
      <TranscriptionButton />
    </Box>
  );
};

export default AudioHeader;
