import { useProjectContext } from '../app/contexts/ProjectContext';
import styles from '../styles/noteDashboard.module.scss';
import ScrollView from '../app/components/ScrollView';
import TranscriptionDisplay from '../app/components/TranscriptionDisplay';
import TranscriptionButton from '@/app/components/Transcription';

export default function Home() {
  const { selectedNote } = useProjectContext();

  return (
    <div className={styles.container}>
      <ScrollView>
        <div className={styles.noteWrapper}>
          <TranscriptionButton />
          <TranscriptionDisplay />
        </div>
      </ScrollView>
    </div>
  );
}
