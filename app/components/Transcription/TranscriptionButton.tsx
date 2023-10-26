import React, {useEffect, useRef} from 'react';
import {useProjectContext} from '@/app/contexts/ProjectContext';
import {useErrorModalContext} from '@/app/contexts/ErrorModalContext';
import {transcribe} from '@/app/api/transcription';
import IconButton from '@mui/material/IconButton';
import {useNoteContext} from '@/app/contexts/NoteContext';
import {TbFileTextAi} from 'react-icons/tb';
import {Tooltip} from '@mui/material';

/**
 * A button that grabs the selected note and transcribes the audio. .
 * @constructor
 */
const TranscriptionButton = () => {
  const BASE_URL = 'http://localhost:3000';
  const context = useProjectContext();
  const { setErrorMessage, setIsError } = useErrorModalContext();
  const selectedNote = context.selectedNote;
  const { setTranscription } = useNoteContext();

  const selectedNoteRef = useRef(selectedNote);

  useEffect(() => {
    selectedNoteRef.current = selectedNote;
  }, [selectedNote]);

  /**
   * Transcribes audio with Whisper and sets transcription state to the new transcription.
   */
  const transcribeAudio = () => {
    try {
      if (selectedNote) {
        try {
          // Transcribe audio
          transcribe(
            selectedNote?.audioLocation,
            BASE_URL,
            selectedNote?.id,
          ).then((transcription) => {
            if (!transcription) {
              return;
            }

            // Check that the selected note has not changed since the transcription was requested
            const currentNoteId = selectedNoteRef.current
              ? selectedNoteRef.current.id
              : null;
            if (selectedNote.id !== currentNoteId) {
              return;
            }

            // Set transcription in the NoteContext so that the display updates
            // this works
            setTranscription(transcription.text);
          });
        } catch (err: any) {
          setErrorMessage(err.message);
          setIsError(true);
        }
      } else {
        // There should be a selected note if this button is pressed
        setIsError(true);
        setErrorMessage('No note selected.');
      }
    } catch (error) {
      console.log(error);
      setIsError(true);
      if (error instanceof Error) setErrorMessage(error.message);
    }
  };

  return (
    <Tooltip title="Transcribe">
      <IconButton
        sx={{
          //temporary styling for presentation
          width: '50px',
          height: '50px',
        }}
        disabled={!selectedNote?.audioLocation}
        onClick={transcribeAudio}
      >
        <TbFileTextAi />
      </IconButton>
    </Tooltip>
  );
};

export default TranscriptionButton;
