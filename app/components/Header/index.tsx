import React from 'react';
import styles from './header.module.scss';
import dynamic from 'next/dynamic';
import { RecorderProvider } from '../../contexts/RecorderContext';
import Link from "next/link";

const Recorder = dynamic(() => import('../../components/Recorder'), {
  ssr: false,
});

function Header() {
  return (
    <div className={styles.header}>
      <RecorderProvider>
        <Recorder />
      </RecorderProvider>
        <div className={styles.linkContainer}>
            <Link href="/settings/profile">
                <span className={styles.link}>Settings</span>
            </Link>
        </div>
    </div>
  );
}

export default Header;
