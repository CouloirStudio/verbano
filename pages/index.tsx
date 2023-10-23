import { useProjectContext } from '../app/contexts/ProjectContext';
import styles from '../styles/noteDashboard.module.scss';
import ScrollView from '../app/components/ScrollView';
import TranscriptionDisplay from '../app/components/TranscriptionDisplay';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

export default function Home() {
  const { selectedNote } = useProjectContext();

  return (
    <div className={styles.container}>
      <ScrollView>
        <div className={styles.noteWrapper}>
          <TranscriptionDisplay />
        </div>
      </ScrollView>
      <div className={styles.footer}>
        <Box className={styles.footerContent}>
          <Typography variant={'subtitle1'}>Source Mode</Typography>
          {selectedNote && selectedNote.transcription && (
            <Typography variant={'subtitle1'}>
              Words: {selectedNote?.transcription?.split(' ').length}
            </Typography>
          )}
          {selectedNote && selectedNote.transcription && (
            <Typography variant={'subtitle1'}>
              Characters: {selectedNote?.transcription?.length}
            </Typography>
          )}
        </Box>
      </div>
    </div>
  );
}
