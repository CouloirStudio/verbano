import React, { useEffect, useRef } from 'react';
import { useProjectContext } from '@/app/contexts/ProjectContext';
import { useErrorModalContext } from '@/app/contexts/ErrorModalContext';
import { SpeedDial, SpeedDialAction, useTheme } from '@mui/material';
import { useNoteContext } from '@/app/contexts/NoteContext';
import { FaWandMagicSparkles } from 'react-icons/fa6';
import { useProgress } from '@/app/contexts/ProgressContext';
import { MdOutlineSettings, MdOutlineSummarize } from 'react-icons/md';
import { useGenerateSummary } from '@/app/hooks/useSummaryGeneration';

interface SummarizeButtonProps {
  onOpenModal: () => void;
}

/**
 * A button that grabs the selected notes and generates a summary.
 */
const SummarizeButton: React.FC<SummarizeButtonProps> = ({ onOpenModal }) => {
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

  const { updateProgress, removeTask } = useProgress();

  /**
   * Generates a summary of the selected notes.
   */
  const generateSummary = useGenerateSummary(BASE_URL);

  const disabled = !selectedNote?.transcription;
  const tooltipTitle = disabled
    ? 'Transcribe the note before summarizing'
    : 'Summarize';
  const color = disabled ? theme.palette.action.disabled : '#8675fd';

  const actions = [
    {
      icon: <MdOutlineSummarize size={25} />,
      name: 'Basic Summary',
      onClick: () => generateSummary(),
    },
    {
      icon: <MdOutlineSettings size={25} />,
      name: 'Advanced Summary',
      onClick: () => onOpenModal(),
    },
  ];

  return (
    <SpeedDial
      ariaLabel="Summary Speed Dial"
      sx={{
        '.MuiSpeedDial-fab': {
          width: '50px',
          height: '50px',
          bgcolor: 'transparent',
          color: theme.palette.secondary.main,
          boxShadow: 'none',
          '&:hover': {
            bgcolor: 'rgba(0, 0, 0, 0.04)',
          },
        },
        '.MuiSpeedDial-directionDown': {
          position: 'absolute',
          top: '56px', // Adjust this value as needed
        },
        '.MuiSpeedDial-actions': {
          position: 'absolute',
          marginTop: '0px',
        },
      }}
      icon={<FaWandMagicSparkles size={25} />}
      direction="down"
    >
      {actions.map((action) => (
        <SpeedDialAction
          key={action.name}
          icon={action.icon}
          tooltipTitle={action.name}
          onClick={action.onClick}
        />
      ))}
    </SpeedDial>
  );
};

export default SummarizeButton;
