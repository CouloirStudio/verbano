import React from "react";
import { useProjectContext } from "@/app/contexts/ProjectContext";
import { useErrorModalContext } from "@/app/contexts/ErrorModalContext";
import { transcribe } from "@/app/api/transcription";
import IconButton from "@mui/material/IconButton";
import DriveFileRenameOutlineOutlinedIcon from "@mui/icons-material/DriveFileRenameOutlineOutlined";
import { useNoteContext } from "@/app/contexts/NoteContext";

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

  /**
   * Transcribes audio with Whisper and sets transcription state to the new transcription.
   */
  const transcribeAudio = () => {
    try {
      if (selectedNote) {
        // Transcribe audio
        transcribe(
          selectedNote?.audioLocation,
          BASE_URL,
          selectedNote?.id,
        ).then((transcription) => {
          if (!transcription) {
            return;
          }
          // Set transcription in the NoteContext so that the display updates
          // this works
          setTranscription(transcription.text);
        });
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
    <IconButton disabled={selectedNote === undefined} onClick={transcribeAudio}>
      <DriveFileRenameOutlineOutlinedIcon />
    </IconButton>
  );
};

export default TranscriptionButton;
