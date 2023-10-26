import React from 'react';
import Header from '@/app/components/Header';
import Sidebar from '@/app/components/Sidebar';
import styles from './layout.module.scss';
import { ErrorModalContextProvider } from '@/app/contexts/ErrorModalContext';
import ErrorModal from '@/app/components/ErrorModal';

interface LayoutProps {
  children: React.ReactNode;
}

function Layout({ children }: LayoutProps) {
  return (
    <ErrorModalContextProvider>
      <div className={styles.layoutContainer}>
        <ErrorModal />
        <Header />
        <div className={styles.contentArea}>
          <Sidebar />
          <main className={styles.mainArea}>{children}</main>
        </div>
      </div>
    </ErrorModalContextProvider>
  );
}

export default Layout;
