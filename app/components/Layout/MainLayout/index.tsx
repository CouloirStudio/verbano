import React from 'react';
import Header from '@/app/components/Layout/Header';
import Sidebar from '@/app/components/Layout/Sidebar';
import styles from './layout.module.scss';
import { DraggingProvider } from '@/app/contexts/DraggingContext';
import { NoteListContextProvider } from '@/app/contexts/NoteListContext';
import Box from '@mui/material/Box';

interface LayoutProps {
  children: React.ReactNode;
}

/**
 * Layout represents the core layout of the web page, and houses most other components.
 */
function Layout({ children }: LayoutProps) {
  return (
    <Box className={styles.layoutContainer}>
      <Header />
      <div className={styles.contentArea}>
        <DraggingProvider>
          <NoteListContextProvider>
            <Sidebar />
          </NoteListContextProvider>
        </DraggingProvider>
        <main className={styles.mainArea}>{children}</main>
      </div>
    </Box>
  );
}

export default Layout;
