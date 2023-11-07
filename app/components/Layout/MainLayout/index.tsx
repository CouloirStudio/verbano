import React from 'react';
import Header from '@/app/components/Layout/Header';
import Sidebar from '@/app/components/Layout/Sidebar';
import styles from './layout.module.scss';
import { DraggingProvider } from '@/app/contexts/DraggingContext';
import { NoteListContextProvider } from '@/app/contexts/NoteListContext';

interface LayoutProps {
  children: React.ReactNode;
}

function Layout({ children }: LayoutProps) {
  return (
    <div className={styles.layoutContainer}>
      <Header />
      <div className={styles.contentArea}>
        <DraggingProvider>
          <NoteListContextProvider>
            <Sidebar />
          </NoteListContextProvider>
        </DraggingProvider>
        <main className={styles.mainArea}>{children}</main>
      </div>
    </div>
  );
}

export default Layout;
