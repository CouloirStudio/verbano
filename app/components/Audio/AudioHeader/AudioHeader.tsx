import React, {useEffect, useState} from 'react';
import {useProjectContext} from '@/app/contexts/ProjectContext';
import Recorder from '@/app/components/Audio/Recorder';
import {Playback} from '@/app/components/Audio/Playback';
import {TranscriptionButton} from '@/app/components/Audio/Transcription';
import {useNoteContext} from '@/app/contexts/NoteContext';
import {useTheme} from '@mui/material/styles';
import SummarizeButton from '@/app/components/Audio/Summary/SummarizeButton';
import {Stack} from '@mui/material';
import Typography from '@mui/material/Typography';
import useDoubleClickEdit from '@/app/hooks/useDoubleClickEdit';
import TextField from '@mui/material/TextField';
import {useMutation} from '@apollo/client';
import UpdateNote from '@/app/graphql/mutations/UpdateNote.graphql';

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
  const { selectedNote, setSelectedNote, selectedProject, refetchData } =
    useProjectContext();
  const { refreshNoteDetails } = useNoteContext();
  const [updateNote] = useMutation(UpdateNote);
  const [name, setName] = useState<string>(
    selectedNote?.noteName ?? 'Untitled',
  );
  const [hasRecording, setHasRecording] = useState(false);
  const theme = useTheme();

  // Update the component state based on the presence of an audio recording in the selected note.
  useEffect(() => {
    setHasRecording(!!(selectedNote && selectedNote.audioLocation));
  }, [selectedNote]);

  function epocToFriendlyDate(epoch: string) {
    const date = new Date(parseInt(epoch));
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }

  const {
    isEditing,
    value,
    handleChange,
    handleSubmit,
    handleDoubleClick,
    handleBlur,
    handleKeyDown,
    exitEditing,
  } = useDoubleClickEdit(name);

  const submitUpdate = async (newValue: string): Promise<void> => {
    if (newValue === selectedNote?.noteName) {
      setName(newValue);
      return;
    }
    if (newValue.trim() === '') {
      setName(selectedNote?.noteName ?? 'Untitled');
      return;
    }

    setName(newValue.trim());
    try {
      await updateNote({
        variables: {
          id: selectedNote?.id,
          input: {
            noteName: newValue,
          },
        },
      });

      refetchData();
    } catch (e) {
      setName(selectedNote?.noteName ?? 'Untitled');
      console.error('Error updating note:', e);
    }
  };

  return (
    <Stack
      direction={'row'}
      alignItems={'center'}
      justifyContent={'space-evenly'}
      sx={{
        color: theme.custom?.text,
      }}
    >
      <Stack
        width={'33%'}
        direction={'row'}
        alignItems={'center'}
        justifyContent={'center'}
      >
        {isEditing ? (
          <TextField
            variant="standard"
            type="text"
            value={value}
            onChange={handleChange}
            onBlur={handleBlur}
            onKeyDown={(e) => handleKeyDown(e, submitUpdate)}
            autoFocus
          />
        ) : (
          <Typography
            variant={'h3'}
            color={'text.primary'}
            onDoubleClick={handleDoubleClick}
          >
            {selectedNote?.noteName}
          </Typography>
        )}
      </Stack>
      <Stack
        width={'33%'}
        direction={'row'}
        alignItems={'center'}
        justifyContent={'center'}
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
      </Stack>
      <Stack
        width={'33%'}
        direction={'row'}
        alignItems={'center'}
        justifyContent={'center'}
      >
        <Typography variant={'subtitle1'} color={'text.secondary'} noWrap>
          {epocToFriendlyDate(selectedNote?.dateCreated?.toString() ?? '')}
        </Typography>
      </Stack>
    </Stack>
  );
};

export default AudioHeader;
