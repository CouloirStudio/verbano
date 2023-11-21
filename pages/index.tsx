import { useProjectContext } from '@/app/contexts/ProjectContext';
import styles from '@/pages/styles/noteDashboard.module.scss';
import TranscriptionDisplay from '@/app/components/Audio/Transcription/TranscriptionDisplay';
import { NoteContextProvider } from '@/app/contexts/NoteContext';
import { AudioHeader } from '@/app/components/Audio/AudioHeader';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';

export default function Home() {
  const { selectedNote } = useProjectContext();
  const theme = useTheme();
  const backgroundColour = theme.custom?.mainBackground ?? '';
  return (
    <div className={styles.container}>
      <Box
        className={styles.noteWrapper}
        sx={{ backgroundColor: backgroundColour }}
      >
        {selectedNote && (
          <NoteContextProvider>
            <AudioHeader />
            <TranscriptionDisplay />
          </NoteContextProvider>
        )}
      </Box>
    </div>
  );
}
