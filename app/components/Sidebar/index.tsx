import styles from './sidebar.module.scss';
import { useProjectContext } from '../../contexts/ProjectContext';
import Project from '../Project';
import { NoteType, ProjectType } from '../../resolvers/types';

function Sidebar() {
  const { setSelectedNotes, projects } = useProjectContext();

  if (!projects) return <p>Loading...</p>;

  const handleProjectClick = (notes: NoteType[]) => {
    setSelectedNotes(notes);
  };

  const handleKeyDown = (e: React.KeyboardEvent, notes: NoteType[]) => {
    if (e.key === 'Enter' || e.key === 'Space') {
      handleProjectClick(notes);
    }
  };

  return (
    <div className={styles.sidebar}>
      {projects.map((project: ProjectType) => (
        <div
          key={project.id}
          onClick={() => handleProjectClick(project.notes)}
          onKeyDown={(e) => handleKeyDown(e, project.notes)}
          role="button"
          tabIndex={0}
        >
          <Project projectName={project.projectName} notes={project.notes} />
        </div>
      ))}
    </div>
  );
}

export default Sidebar;
