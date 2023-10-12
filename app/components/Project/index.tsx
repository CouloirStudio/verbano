import styles from './Project.module.scss';
import Note from '../Note';
import { NoteType } from '../../resolvers/types';

type ProjectProps = {
  projectName: string;
  notes: NoteType[];
};

function Project({ projectName, notes }: ProjectProps) {
  // Log the notes here
  console.log(notes);

  return (
    <div className={styles.project}>
      <h2 className={styles.projectName}>{projectName}</h2>
      <div className={styles.notesContainer}>
        {notes.map((note) => {
          // Explicitly destructure the properties from the note
          const { id, noteName } = note;
          return <Note key={id} noteName={noteName} />;
        })}
      </div>
    </div>
  );
}

export default Project;
