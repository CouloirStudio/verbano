import React from 'react';
import styles from './header.module.scss';
import dynamic from 'next/dynamic';
import { RecorderProvider } from '../../contexts/RecorderContext';
import Link from 'next/link';
import { Avatar } from '@mui/material';
import { useUser } from '@/app/components/UserProvider';
import { deepPurple } from '@mui/material/colors';
import Playback from '@/app/components/Playback/Playback';

const Recorder = dynamic(() => import('../../components/Recorder'), {
  ssr: false,
});

function Header() {
  const currentUser = useUser();
  if (!currentUser) return null;

  return (
    <div className={styles.header}>
      <RecorderProvider>
        <Recorder />
      </RecorderProvider>
      <Playback
        audioUrl={'audio-files/1697487143891.wav'}
        baseUrl={'http://localhost:3000'}
      />
      <div className={styles.linkContainer}>
        <Link href="/settings/profile">
          <Avatar sx={{ bgcolor: deepPurple[500] }}>
            {currentUser.firstName?.substring(0, 1)}
          </Avatar>
        </Link>
      </div>
    </div>
  );
}

export default Header;
