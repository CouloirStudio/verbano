import styles from './note.module.scss';

type NoteProps = {
  noteName: string;
  children?: React.ReactNode;
};

function Note({ noteName }: NoteProps) {
  console.log('Note Name:', noteName);
  return <div className={styles.note}>{noteName}</div>;
}

export default Note;
