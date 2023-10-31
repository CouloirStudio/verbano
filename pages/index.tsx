import { useProjectContext } from '@/app/contexts/ProjectContext';
import styles from '@/pages/styles/noteDashboard.module.scss';
import TranscriptionDisplay from '@/app/components/Audio/Transcription/TranscriptionDisplay';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { NoteContextProvider } from '@/app/contexts/NoteContext';
import { AudioHeader } from '@/app/components/Audio/AudioHeader';
import { useTheme } from '@mui/material/styles';

export default function Home() {
  const { selectedNote } = useProjectContext();
  const theme = useTheme();

  return (
    <div
      className={styles.container}
      style={{ backgroundColor: theme.custom?.mainBackground ?? '' }}
    >
      <div className={styles.noteWrapper}>
        {selectedNote && (
          <NoteContextProvider>
            <AudioHeader />
            <TranscriptionDisplay />
          </NoteContextProvider>
        )}
      </div>

      <Box
        className={styles.footer}
        sx={{
          backgroundColor: theme.custom?.contrastBackground ?? '',
          color: theme.custom?.text ?? '',
        }}
      >
        <Box className={styles.footerContent}>
          <Typography variant="subtitle1">Source Mode</Typography>
          {selectedNote && selectedNote.transcription && (
            <>
              <Typography variant="subtitle1">
                Words: {selectedNote.transcription.toString().split(' ').length}
              </Typography>
              <Typography variant="subtitle1">
                Characters: {selectedNote.transcription.toString().length}
              </Typography>
            </>
          )}
        </Box>
      </Box>
    </div>
  );
}
