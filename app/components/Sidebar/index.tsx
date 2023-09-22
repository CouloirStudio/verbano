import styles from './sidebar.module.scss';
import { useProjectContext } from '../../contexts/ProjectContext';
import Project from '../Project';
import Note from '../Note';

function Sidebar() {
  const { setSelectedNotes } = useProjectContext();

  // Dummy data for projects and their names
  const projects = [
    { id: 1, name: 'Project Alpha' },
    { id: 2, name: 'Project Beta' },
    { id: 3, name: 'Project Gamma' },
    { id: 4, name: 'Project Delta' },
  ];

  const handleProjectClick = (notes: React.ReactNode[]) => {
    setSelectedNotes(notes);
  };

  const handleKeyDown = (e: React.KeyboardEvent, notes: React.ReactNode[]) => {
    if (e.key === 'Enter' || e.key === 'Space') {
      handleProjectClick(notes);
    }
  };

  return (
    <div className={styles.sidebar}>
      {projects.map((project) => {
        const projectNotes = Array.from({ length: 10 }).map((_, idx) => (
          <Note key={idx} projectName={project.name} noteNumber={idx + 1} />
        ));

        return (
          <div
            key={project.id}
            onClick={() => handleProjectClick(projectNotes)}
            onKeyDown={(e) => handleKeyDown(e, projectNotes)}
            role="button"
            tabIndex={0}
          >
            <Project name={project.name}>{projectNotes}</Project>
          </div>
        );
      })}
    </div>
  );
}

export default Sidebar;
