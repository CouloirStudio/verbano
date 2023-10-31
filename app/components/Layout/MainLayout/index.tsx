import React from 'react';
import Header from '@/app/components/Layout/Header';
import Sidebar from '@/app/components/Layout/Sidebar';
import styles from './layout.module.scss';

interface LayoutProps {
  children: React.ReactNode;
}

function Layout({ children }: LayoutProps) {
  return (
    <div className={styles.layoutContainer}>
      <Header />
      <div className={styles.contentArea}>
        <Sidebar />
        <main className={styles.mainArea}>{children}</main>
      </div>
    </div>
  );
}

export default Layout;
