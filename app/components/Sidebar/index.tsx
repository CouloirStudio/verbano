import { useQuery } from '@apollo/client';
import { GET_PROJECTS_AND_NOTES } from '../../graphql/queries/getNotes';
import styles from './sidebar.module.scss';
import { useProjectContext } from '../../contexts/ProjectContext';
import Project from '../Project';
import { NoteType, ProjectType } from '../../resolvers/types';

function Sidebar() {
  const { setSelectedNotes } = useProjectContext();
  const { data, loading, error } = useQuery<{ listProjects: ProjectType[] }>(
    GET_PROJECTS_AND_NOTES,
  );

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

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
      {data?.listProjects.map((project: ProjectType) => (
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
