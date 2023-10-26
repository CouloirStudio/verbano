import { useProjectContext } from '../app/contexts/ProjectContext';
import styles from '../styles/noteDashboard.module.scss';
import TranscriptionDisplay from '../app/components/Transcription/TranscriptionDisplay';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { NoteContextProvider } from '@/app/contexts/NoteContext';
import NoteDetails from '@/app/components/Note/NoteDetails';
import { useTheme } from '@mui/material/styles';

export default function Home() {
  const { selectedNote } = useProjectContext();
  const theme = useTheme();

  return (
    <div className={styles.container} style={{ backgroundColor: theme.custom?.contrastBackground ?? '' }}>
      <div className={styles.noteWrapper}>
        {selectedNote && (
          <NoteContextProvider>
            <NoteDetails />

            <TranscriptionDisplay />
          </NoteContextProvider>
        )}
      </div>

      <div className={styles.footer} style={{ backgroundColor: theme.custom?.moreContrastBackground ?? '', color: theme.custom?.text ?? '' }}>
        <Box className={styles.footerContent}>
          <Typography variant={'subtitle1'}>Source Mode</Typography>
          {selectedNote && selectedNote.transcription && (
            <Typography variant={'subtitle1'}>
              Words: {selectedNote?.transcription?.toString().split(' ').length}
            </Typography>
          )}
          {selectedNote && selectedNote.transcription && (
            <Typography variant={'subtitle1'}>
              Characters: {selectedNote?.transcription?.toString().length}
            </Typography>
          )}
        </Box>
      </div>
    </div>
  );
}
