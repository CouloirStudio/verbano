import { useProjectContext } from '../app/contexts/ProjectContext';
import styles from '../styles/noteDashboard.module.scss';
import ScrollView from '../app/components/ScrollView';

export default function Home() {
  const { selectedNotes } = useProjectContext();

  return (
    <div className={styles.container}>
      <ScrollView>
        <div className={styles.noteWrapper}>{selectedNotes}</div>
      </ScrollView>
    </div>
  );
}
