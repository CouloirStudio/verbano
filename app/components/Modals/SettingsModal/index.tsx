import React from 'react';
import Dialog from '@mui/material/Dialog';
import { DialogContent } from '@mui/material';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import Settings from './Settings';
import Button from '@mui/material/Button';

interface ModalComponentProps {
  open: boolean;
  handleClose: () => void;
}

export default function ModalComponent({
  open,
  handleClose,
}: ModalComponentProps) {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="scroll-dialog-title"
      aria-describedby="scroll-dialog-description"
    >
      <DialogTitle id="scroll-dialog-title">Settings</DialogTitle>
      <DialogContent>
        <Settings />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
