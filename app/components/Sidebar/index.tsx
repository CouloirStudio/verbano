import styles from './sidebar.module.scss';
import Project from '../Project';
import Note from '../Note';

function Sidebar() {
  // Dummy data for projects and their names
  const projects = [
    { id: 1, name: 'Project Alpha' },
    { id: 2, name: 'Project Beta' },
    { id: 3, name: 'Project Gamma' },
    { id: 4, name: 'Project Delta' },
  ];

  return (
    <div className={styles.sidebar}>
      <h1>Sidebar Content</h1>
      {projects.map((project) => (
        <Project key={project.id} name={project.name}>
          {Array.from({ length: 4 }).map((_, idx) => (
            <Note key={idx} />
          ))}
        </Project>
      ))}
    </div>
  );
}

export default Sidebar;
