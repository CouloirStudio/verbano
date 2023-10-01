import { useQuery } from '@apollo/client';
import { GET_PROJECTS_AND_NOTES } from '../../graphql/queries/getNotes';
import styles from './sidebar.module.scss';
import { useProjectContext } from '../../contexts/ProjectContext';
import Project from '../Project';
import Note from '../Note';

function Sidebar() {
  const { setSelectedNotes } = useProjectContext();
  const { data, loading, error } = useQuery(GET_PROJECTS_AND_NOTES);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const handleProjectClick = (notes) => {
    setSelectedNotes(notes);
  };

  const handleKeyDown = (e, notes) => {
    if (e.key === 'Enter' || e.key === 'Space') {
      handleProjectClick(notes);
    }
  };

  return (
    <div className={styles.sidebar}>
      {data.listProjects.map((project) => (
        <div
          key={project.id}
          onClick={() => handleProjectClick(project.notes)}
          onKeyDown={(e) => handleKeyDown(e, project.notes)}
          role="button"
          tabIndex={0}
        >
          <Project name={project.name}>
            {project.notes.map((note) => (
              <Note
                key={note.id}
                projectName={project.name}
                noteNumber={note.noteName}
              />
            ))}
          </Project>
        </div>
      ))}
    </div>
  );
}

export default Sidebar;
