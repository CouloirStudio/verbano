import styles from './Project.module.scss';

type ProjectProps = {
  name: string;
  children: React.ReactNode;
};

function Project({ name, children }: ProjectProps) {
  return (
    <div className={styles.project}>
      <h2 className={styles.projectName}>{name}</h2>
      <div className={styles.notesContainer}>{children}</div>
    </div>
  );
}

export default Project;
