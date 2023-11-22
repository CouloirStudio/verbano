import React, {useEffect, useRef} from 'react';
import {useProjectContext} from '@/app/contexts/ProjectContext';
import {useErrorModalContext} from '@/app/contexts/ErrorModalContext';
import {summarize} from '@/app/api/summarize'; // You need to implement this
import IconButton from '@mui/material/IconButton';
import {Tooltip, useTheme} from '@mui/material';
import {useNoteContext} from '@/app/contexts/NoteContext';
import {FaWandMagicSparkles} from 'react-icons/fa6';

/**
 * A button that grabs the selected notes and generates a summary.
 * @constructor
 */
const SummarizeButton = () => {
  const BASE_URL = 'https://localhost:3000';
  const { selectedNote } = useProjectContext();
  const { setErrorMessage, setIsError } = useErrorModalContext();
  const selectedNotes = [selectedNote]; // Assuming multiple notes can be selected
  const { setSummary } = useNoteContext();

  const selectedNotesRef = useRef(selectedNotes);
  const theme = useTheme();

  useEffect(() => {
    selectedNotesRef.current = selectedNotes;
  }, [selectedNotes]);

  /**
   * Generates a summary of the selected notes.
   */
  const generateSummary = async () => {
    try {
      if (selectedNotes && selectedNotes.length > 0) {
        const summary = await summarize(selectedNotes, null, BASE_URL); // Assuming 'null' as a placeholder for templateId

        // Check that the selected notes have not changed since the summary was requested
        if (
          JSON.stringify(selectedNotes) !==
          JSON.stringify(selectedNotesRef.current)
        ) {
          return;
        }

        // Set summary in the ProjectContext so that the display updates
        setSummary(summary);
      } else {
        // There should be selected notes if this button is pressed
        setIsError(true);
        setErrorMessage('No notes selected.');
      }
    } catch (error) {
      console.log(error);
      setIsError(true);
      if (error instanceof Error) setErrorMessage(error.message);
    }
  };

  const disabled = !selectedNote?.transcription;
  const tooltipTitle = disabled ? 'Transcribe the note first' : 'Summarize';

  return (
    <Tooltip title={tooltipTitle}>
      <span>
        <IconButton
          sx={{
            width: '50px',
            height: '50px',
          }}
          disabled={!selectedNote?.transcription}
          onClick={generateSummary}
          classes={{
            disabled: theme.palette.action.disabled,
          }}
        >
          <FaWandMagicSparkles />
        </IconButton>
      </span>
    </Tooltip>
  );
};

export default SummarizeButton;
