import styles from './Project.module.scss';
import Note from '../Note';
import { NoteType } from '../../resolvers/types';

/**
 * Props for the Project component.
 */
type ProjectProps = {
  /** Name of the project. */
  projectName: string;
  /** Array of notes associated with the project. */
  notes: NoteType[];
};

/**
 * A functional component representing a project and its associated notes.
 *
 * @param projectName - The name of the project to be displayed.
 * @param notes - An array of notes associated with the project.
 */
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
