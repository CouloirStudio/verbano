import { useProjectContext } from '@/app/contexts/ProjectContext';
import styles from '@/pages/styles/noteDashboard.module.scss';
import TranscriptionDisplay from '@/app/components/Audio/Transcription/TranscriptionDisplay';
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
    </div>
  );
}
