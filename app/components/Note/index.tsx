import styles from './note.module.scss';

type NoteProps = {
  projectName: string;
  noteName: string;
  children?: React.ReactNode;
};

function Note({ projectName, noteName }: NoteProps) {
  return (
    <div className={styles.note}>
      {projectName}: Note {noteName}
    </div>
  );
}

export default Note;
