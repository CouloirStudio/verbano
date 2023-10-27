import React from 'react';
import Header from '@/app/components/Layout/Header';
import Sidebar from '@/app/components/Layout/Sidebar';
import styles from './layout.module.scss';
import { ErrorModalContextProvider } from '@/app/contexts/ErrorModalContext';
import ErrorModal from '@/app/components/Modals/ErrorModal';

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
