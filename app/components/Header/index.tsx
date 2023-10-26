import React, { useState } from 'react';
import styles from './header.module.scss';
import {
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  Divider,
  useTheme,
  Theme,
} from '@mui/material';
import { Nightlight, WbSunny } from '@mui/icons-material';
import { BiLogOut } from 'react-icons/bi';
import { IoSettingsOutline } from 'react-icons/io5';
import { useUser } from '@/app/components/UserProvider';
import { useThemeContext } from '@/app/contexts/ThemeContext';
import ModalComponent from '@/app/components/Settings/SettingsModal';
import { deepPurple } from '@mui/material/colors';

/**
 * Extends the MUI Theme with custom properties.
 */
interface CustomTheme extends Theme {
  custom?: {
    headerBackground?: string;
  };
}

/**
 * Generates style properties for an avatar based on the user's name.
 * @param name - The name of the user.
 * @param theme - The theme object used for styling.
 * @returns An object containing style properties for the avatar.
 */
function stringAvatar(name: string, theme: CustomTheme) {
  const secondaryPalette = [
    theme.palette.info.light,
    theme.palette.info.main,
    theme.palette.info.dark,
  ];
  const randomIndex = Math.floor(name.length % secondaryPalette.length);
  return {
    sx: {
      bgcolor: secondaryPalette[randomIndex],
      color: theme.palette.getContrastText(secondaryPalette[randomIndex]),
    },
  };
}

/**
 * Header component displaying the user's avatar and theme toggle button.
 */
const Header: React.FC = () => {
  const currentUser = useUser();
  const theme: CustomTheme = useTheme();
  const { isDarkMode, toggleTheme } = useThemeContext();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isModalOpen, setModalOpen] = useState(false);

  const open = Boolean(anchorEl);
  const headerBackgroundColor = theme.custom?.headerBackground ?? '';
  const userName = currentUser
    ? `${currentUser.firstName} ${currentUser.lastName}`
    : '';

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  if (!currentUser) return null;

  return (
    <div
      className={styles.header}
      style={{ backgroundColor: headerBackgroundColor }}
    >
      <div className={styles.linkContainer}>
        <IconButton onClick={toggleTheme} className="roundedPrimary">
          {isDarkMode ? <WbSunny /> : <Nightlight />}
        </IconButton>
        <Avatar
          {...stringAvatar(userName, theme)}
          onClick={handleMenuOpen}
          sx={{ bgcolor: deepPurple[500] }}
        >
          {currentUser.firstName?.[0]}
        </Avatar>
        <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
          <MenuItem
            onClick={() => {
              handleMenuClose();
              openModal();
            }}
            className="menu-item"
          >
            <IoSettingsOutline />
            Settings
          </MenuItem>

          <Divider />

          <MenuItem
            onClick={() => {
              handleMenuClose();
              window.location.replace('/logout');
            }}
            className="menu-item"
          >
            <BiLogOut />
            Logout
          </MenuItem>
        </Menu>
      </div>

      <ModalComponent open={isModalOpen} onClose={closeModal} />
    </div>
  );
};

export default Header;
