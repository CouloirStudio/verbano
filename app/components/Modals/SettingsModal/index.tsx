import React from 'react';
import UpdatePasswordForm from '@/app/components/Settings/UpdatePasswordForm/UpdatePasswordForm';
import UpdateEmailForm from '@/app/components/Settings/UpdateEmailForm/UpdateEmailForm';
import UpdateNameForm from '@/app/components/Settings/UpdateNameForm/UpdateNameForm';
import Dialog, { DialogProps } from '@mui/material/Dialog';
import { DialogContent } from '@mui/material';
import DialogTitle from '@mui/material/DialogTitle';

interface ModalComponentProps {
  open: boolean;
  handleClose: () => void;
}

export default function ModalComponent({
  open,
  handleClose,
}: ModalComponentProps) {
  const [scroll] = React.useState<DialogProps['scroll']>('paper');
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      scroll={scroll}
      aria-labelledby="scroll-dialog-title"
      aria-describedby="scroll-dialog-description"
    >
      <DialogTitle id="scroll-dialog-title">Settings</DialogTitle>
      <DialogContent>
        <UpdateEmailForm value={''} onChange={() => {}} />
        <UpdateNameForm
          firstName={''}
          lastName={''}
          onFirstNameChange={() => {}}
          onLastNameChange={() => {}}
        />
        <UpdatePasswordForm value={''} onChange={() => {}} />
      </DialogContent>
    </Dialog>
  );
}
