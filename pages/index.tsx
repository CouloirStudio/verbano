import { useProjectContext } from '../app/contexts/ProjectContext';
import styles from '../styles/noteDashboard.module.scss';
import ScrollView from '../app/components/ScrollView';
import TranscriptionDisplay from '../app/components/Transcription/TranscriptionDisplay';
import TranscriptionButton from '@/app/components/Transcription/TranscriptionButton';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { NoteContextProvider } from '@/app/contexts/NoteContext';

export default function Home() {
  const { selectedNote } = useProjectContext();

  return (
    <div className={styles.container}>
      <ScrollView>
        <div className={styles.noteWrapper}>
          <NoteContextProvider>
            <TranscriptionButton />
            <TranscriptionDisplay />
          </NoteContextProvider>
        </div>
      </ScrollView>
      <div className={styles.footer}>
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
