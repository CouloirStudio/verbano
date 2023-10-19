import React from 'react';
import styles from './sidebar.module.scss';
import { useProjectContext } from '../../contexts/ProjectContext';
import ProjectTree from '../ProjectTree';
import NoteTree from '@/app/components/NoteTree';

function Sidebar() {
  const { projects } = useProjectContext();

  if (!projects) return <p>Loading...</p>;

  return (
    <div className={styles.sidebar}>
      <ProjectTree />
      <NoteTree />
    </div>
  );
}

export default Sidebar;
