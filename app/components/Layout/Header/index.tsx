import React, {useState} from 'react';
import styles from './header.module.scss';
import {Avatar, Divider, IconButton, Menu, MenuItem, Stack, Theme, useTheme,} from '@mui/material';
import {Nightlight, WbSunny} from '@mui/icons-material';
import {BiLogOut} from 'react-icons/bi';
import {IoSettingsOutline} from 'react-icons/io5';
import {useUser} from '@/app/contexts/UserContext';
import {useThemeContext} from '@/app/contexts/ThemeContext';
import {deepPurple} from '@mui/material/colors';
import {SettingsModal} from '@/app/components/Modals/SettingsModal';
import Typography from '@mui/material/Typography';

/**
 * Generates style properties for an avatar based on the user's name.
 * @param name - The name of the user.
 * @param theme - The theme object used for styling.
 * @returns An object containing style properties for the avatar.
 */
function stringAvatar(name: string, theme: Theme) {
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
  const theme = useTheme();
  const { isDarkMode, toggleTheme } = useThemeContext();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isModalOpen, setModalOpen] = useState(false);

  const open = Boolean(anchorEl);
  const headerBackgroundColor = theme.custom?.headerBackground ?? '';
  const svgStyle = {
    fill: theme.custom?.logoColour,
  };

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
      {/* Logo Container */}
      <div className={styles.logoContainer}>
        <svg
          className={styles.logo}
          xmlns="http://www.w3.org/2000/svg"
          width="190"
          height="190"
          viewBox="0 0 190 190"
          fill="none"
        >
          <path
            style={svgStyle}
            d="M7.49255 81.4355V77.6842C7.49255 74.0696 10.6674 71.1389 14.5943 71.1389C18.5213 71.1389 21.5301 73.9328 21.6766 77.4302V76.5803C21.6766 76.5803 21.6864 79.2863 26.473 79.2863C26.473 79.2863 31.2596 79.2863 31.2596 73.2979V60.6859C31.2596 53.7205 37.3846 48.0739 44.9357 48.0739C52.4869 48.0739 58.6118 53.7205 58.6118 60.6859C61.601 41.343 68.1753 24.5792 71.0571 17.8678C71.3599 16.7834 71.819 15.7674 72.4149 14.8198C72.4344 14.7709 72.454 14.7514 72.454 14.7514C72.454 14.7514 72.454 14.7514 72.454 14.7612C74.7398 11.1857 78.9501 8.78246 83.7758 8.78246C90.3892 8.78246 95.8499 13.2958 96.7779 19.1573L96.9342 19.001C96.9342 19.001 105.648 72.9755 96.9342 150.533L163.674 29.3563C146.373 11.2736 122.001 0 95 0C47.1434 0 7.55116 35.3936 0.967095 81.4355H7.49255Z"
          />
          <path
            style={svgStyle}
            d="M80.8257 43.3847C72.4638 76.6487 67.726 129.05 67.726 129.05C67.726 132.665 64.5512 135.596 60.6242 135.596C56.6972 135.596 53.5224 132.665 53.5224 129.05C53.5224 128.816 53.5419 128.581 53.5614 128.347C55.9841 91.7518 47.6514 77.1567 45.4437 73.9915V106.738C45.4437 110.352 42.2689 113.283 38.3419 113.283C34.4149 113.283 31.2401 110.352 31.2401 106.738V94.0475C31.2401 94.0475 31.2401 89.2313 26.4535 89.2313C23.2298 89.2313 22.0576 91.2535 21.6278 92.5724C21.5887 92.9534 21.5008 93.3246 21.3933 93.6763C20.5434 96.4116 17.818 98.4143 14.5748 98.4143C10.6576 98.4143 7.47301 95.4836 7.47301 91.869V89.2215H0.175835C0.0586118 91.1363 0 93.051 0 94.9951C0 140.422 31.8848 178.394 74.4956 187.773L80.8257 43.375V43.3847Z"
          />
          <path
            style={svgStyle}
            d="M165.588 31.4273L95.4298 190C147.702 189.766 190 147.328 190 95.0049C190 70.5527 180.759 48.2595 165.588 31.4273Z"
          />
        </svg>
      </div>
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
            <Stack direction={'row'} alignItems={'center'} spacing={2}>
              <IoSettingsOutline />
              <Typography>Settings</Typography>
            </Stack>
          </MenuItem>

          <Divider />

          <MenuItem
            onClick={() => {
              handleMenuClose();
              window.location.replace('/logout');
            }}
            className="menu-item"
          >
            <Stack direction={'row'} alignItems={'center'} spacing={2}>
              <BiLogOut />
              <Typography> Logout</Typography>
            </Stack>
          </MenuItem>
        </Menu>
      </div>

      <SettingsModal open={isModalOpen} handleClose={closeModal} />
    </div>
  );
};

export default Header;
