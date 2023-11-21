import React, { useEffect, useState } from 'react';
import { useProjectContext } from '@/app/contexts/ProjectContext';
import Box from '@mui/material/Box';
import styles from './audio.module.scss';
import Recorder from '@/app/components/Audio/Recorder';
import { Playback } from '@/app/components/Audio/Playback';
import { TranscriptionButton } from '@/app/components/Audio/Transcription';
import { useNoteContext } from '@/app/contexts/NoteContext';
import { useTheme } from '@mui/material/styles';
import SummarizeButton from '@/app/components/Audio/Summary/SummarizeButton';

/**
 * AudioHeader is a React component that serves as a container for audio-related functionalities,
 * including recording, playback, transcription, and summarization of audio notes.
 * It dynamically renders either the Recorder or Playback component based on whether
 * the currently selected note has an associated audio recording.
 *
 * It utilizes project and note contexts to determine the current state and actions
 * for the selected note and project.
 */
const AudioHeader = () => {
  const { selectedNote, selectedProject } = useProjectContext();
  const { refreshNoteDetails } = useNoteContext();
  const [hasRecording, setHasRecording] = useState(false);
  const theme = useTheme();

  // Update the component state based on the presence of an audio recording in the selected note.
  useEffect(() => {
    setHasRecording(!!(selectedNote && selectedNote.audioLocation));
  }, [selectedNote]);

  return (
    <Box
      className={styles.AudioContainer}
      sx={{
        color: theme.custom?.text,
        backgroundColor: theme.custom?.mainBackground,
      }}
    >
      {!hasRecording ? (
        <Recorder
          refreshNoteDetails={refreshNoteDetails}
          selectedNote={selectedNote}
          selectedProject={selectedProject}
        />
      ) : (
        <Playback
          baseUrl="https://localhost:3000"
          selectedNote={selectedNote}
        />
      )}
      <TranscriptionButton />
      <SummarizeButton />
    </Box>
  );
};

export default AudioHeader;
