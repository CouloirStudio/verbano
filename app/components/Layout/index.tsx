import React from 'react';

import Header from '../Header';
import Sidebar from '../Sidebar';
import styles from './layout.module.scss';
import { ErrorModalContextProvider } from '../../contexts/ErrorModalContext';
import ErrorModal from '../../components/ErrorModal';

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
          <main>{children}</main>
        </div>
      </div>
    </ErrorModalContextProvider>
  );
}

export default Layout;
