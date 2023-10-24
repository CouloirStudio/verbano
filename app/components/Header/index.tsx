import React, { useState } from 'react';
import styles from './header.module.scss';
import dynamic from 'next/dynamic';
import { RecorderProvider } from '../../contexts/RecorderContext';
import Link from 'next/link';
import { Avatar, Divider, Menu, MenuItem } from '@mui/material';
import { useUser } from '@/app/components/UserProvider';
import { deepPurple } from '@mui/material/colors';
import { BiLogOut } from 'react-icons/bi';
import { IoSettingsOutline } from 'react-icons/io5';

const Recorder = dynamic(() => import('../../components/Recorder'), {
  ssr: false,
});

function Header() {
  const currentUser = useUser();

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  if (!currentUser) return null;

  return (
    <div className={styles.header}>
      <RecorderProvider>
        <Recorder />
      </RecorderProvider>
      <div className={styles.linkContainer}>
        <Avatar onClick={handleMenuOpen} sx={{ bgcolor: deepPurple[500] }}>
          {currentUser.firstName?.substring(0, 1)}
        </Avatar>
        <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
          <Link href="/settings/profile">
            <MenuItem sx={{ gap: '5px' }} onClick={handleMenuClose}>
              <IoSettingsOutline />
              Settings
            </MenuItem>
          </Link>
          <Divider />
          <MenuItem
            sx={{ gap: '5px' }}
            onClick={() => {
              handleMenuClose();

              //route to /logout
              window.location.replace('/logout');
            }}
          >
            <BiLogOut />
            Logout
          </MenuItem>
        </Menu>
      </div>
    </div>
  );
}

export default Header;
