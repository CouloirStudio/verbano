import React from 'react';
import styles from './sidebar.module.scss';
import {useProjectContext} from '@/app/contexts/ProjectContext';
import ProjectTree from '@/app/components/Projects/ProjectTree';
import NoteTree from '@/app/components/Notes/NoteTree';
import {DragDropContext} from '@hello-pangea/dnd';
import {useTheme} from '@mui/material/styles';
import {NoteListContextProvider} from '@/app/contexts/NoteListContext';
import {useDragAndDrop} from '@/app/hooks/useDragAndDrop';

/**
 * The Sidebar component handles the drag-and-drop logic for notes within and between projects.
 */
const Sidebar: React.FC = () => {
  const { projects, setSelectedProject } = useProjectContext();

  const theme = useTheme();
  const sidebarBg = theme.custom?.moreContrastBackground ?? '';
  const textColour = theme.custom?.text ?? '';

  if (!projects) return <p>Loading...</p>;

  const { handleDragEnd } = useDragAndDrop(setSelectedProject);
  return (
    <div
      className={styles.sidebar}
      style={{ backgroundColor: sidebarBg, color: textColour }}
    >
      <DragDropContext onDragEnd={handleDragEnd}>
        <ProjectTree />
        <NoteListContextProvider>
          <NoteTree />
        </NoteListContextProvider>
      </DragDropContext>
    </div>
  );
};

export default Sidebar;
