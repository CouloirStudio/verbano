import { useProjectContext } from '../app/contexts/ProjectContext';
import styles from '../styles/noteDashboard.module.scss';
import ScrollView from '../app/components/ScrollView';
import Note from '../app/components/Note';

export default function Home() {
  const { selectedNote } = useProjectContext();

  return (
    <div className={styles.container}>
      <ScrollView>
        <div className={styles.noteWrapper}>
          {selectedNote && <Note noteName={selectedNote.noteName} />}
        </div>
      </ScrollView>
    </div>
  );
}
