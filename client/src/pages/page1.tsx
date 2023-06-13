import React from 'react';
import Link from 'next/link';
import styles from '../styles/pages/index.module.scss';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';

const Page2: React.FC = () => {
  return (
    <div className={styles.container}>
      <Header />
      <Sidebar />
      <div className={styles.main}>
        <h1>Welcome to Page 1</h1>
      </div>
    </div>
  );
};

export default Page2;
