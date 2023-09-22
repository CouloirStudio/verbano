import styles from './note.module.scss';

type NoteProps = {
  projectName: string;
  noteNumber: number;
  children?: React.ReactNode;
};

function Note({ projectName, noteNumber }: NoteProps) {
  return (
    <div className={styles.note}>
      {projectName}: Note #{noteNumber}
    </div>
  );
}

export default Note;
