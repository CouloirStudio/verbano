import React from 'react';
import styles from './sidebar.module.scss';
import { useProjectContext } from '../../contexts/ProjectContext';
import ProjectTree from '../ProjectTree';

function Sidebar() {
  const { projects } = useProjectContext();

  if (!projects) return <p>Loading...</p>;

  return (
    <div className={styles.sidebar}>
      <ProjectTree projects={projects} />
    </div>
  );
}

export default Sidebar;
