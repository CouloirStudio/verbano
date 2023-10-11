import styles from './Project.module.scss';
import Note from '../Note';
import { NoteType } from '../../resolvers/types';

type ProjectProps = {
  projectName: string;
  notes: NoteType[];
};

function Project({ projectName, notes }: ProjectProps) {
  return (
    <div className={styles.project}>
      <h2 className={styles.projectName}>{projectName}</h2>
      <div className={styles.notesContainer}>
        {notes.map(
          (
            note, // Map over the notes and render each one
          ) => (
            <Note
              key={note.id}
              projectName={projectName}
              noteName={note.noteName}
            />
          ),
        )}
      </div>
    </div>
  );
}

export default Project;
