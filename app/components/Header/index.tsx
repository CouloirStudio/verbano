import React, { useState } from 'react';
import styles from './header.module.scss';
import dynamic from 'next/dynamic';
import { RecorderProvider } from '../../contexts/RecorderContext';

import { Avatar, Divider, Menu, MenuItem } from '@mui/material';
import { useUser } from '@/app/components/UserProvider';
import { deepPurple } from '@mui/material/colors';
import { BiLogOut } from 'react-icons/bi';
import { IoSettingsOutline } from 'react-icons/io5';
import ModalComponent from "@/app/components/Settings/SettingsModal";

const Recorder = dynamic(() => import('../../components/Recorder'), {
  ssr: false,
});

function Header(): React.JSX.Element | null {
  const currentUser = useUser();

  const [anchorEl, setAnchorEl] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);

  const open = Boolean(anchorEl);

  const handleMenuOpen = (event): void => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const openModal = () => {
    setModalOpen(true);
  }

  const closeModal = () => {
    setModalOpen(false);
  }


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
          <MenuItem
            sx={{ gap: '5px' }}
            onClick={() => {
              handleMenuClose();
              openModal();
            }}
          >
            <IoSettingsOutline />
            Settings
          </MenuItem>
          <Divider />
          <MenuItem
            sx={{ gap: '5px' }}
            onClick={() => {
              handleMenuClose();
              window.location.replace('/logout');
            }}
          >
            <BiLogOut />
            Logout
          </MenuItem>
        </Menu>
      </div>

      {/* Modal */}
      <ModalComponent open={isModalOpen} onClose={closeModal} />
    </div>
  );

}

export default Header;
