import React from 'react';
import Dialog from '@mui/material/Dialog';
import { DialogContent, Divider } from '@mui/material';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import Settings from './Settings';
import Button from '@mui/material/Button';

interface SettingsModalProps {
  open: boolean;
  handleClose: () => void;
}

/**
 * A modal build of MUI dialog box, this modal houses the settings component.
 * @param props props for the settings modal
 */
const SettingsModal: React.FC<SettingsModalProps> = (props) => {
  const { open, handleClose } = props;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="scroll-dialog-title"
      aria-describedby="scroll-dialog-description"
      maxWidth={'md'}
      fullWidth={true}
    >
      <DialogTitle id="scroll-dialog-title">Settings</DialogTitle>
      <Divider />
      <DialogContent>
        <Settings />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default SettingsModal;
