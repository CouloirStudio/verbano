import styles from './note.module.scss';

/**
 * Props for the Note component.
 */
type NoteProps = {
  /** Name of the note. */
  noteName: string;
  /** Optional children elements that can be nested inside the Note. */
  children?: React.ReactNode;
};

/**
 * A functional component representing a single note.
 *
 * @param noteName - The name of the note to be displayed.
 */
function Note({ noteName }: NoteProps) {
  console.log('Note Name:', noteName);
  return <div className={styles.note}>{noteName}</div>;
}

export default Note;
