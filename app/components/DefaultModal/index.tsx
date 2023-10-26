import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import styles from './defaultmodal.module.scss';

interface ModalProps {
  isOpen: boolean;
  title?: string;
  width?: number | string; // This can be a number (pixels) or a string (like '50%')
  onClose: () => void;
  children?: React.ReactNode;
  className?: string; // New prop
}

export default function DefaultModal({
  isOpen,
  title,
  width = 400,
  onClose,
  children,
  className = styles.modalBox,
}: ModalProps) {
  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box className={className} sx={{ width: width }}>
        {title && (
          <Typography id="modal-modal-title" variant="h6" component="h2">
            {title}
          </Typography>
        )}
        {children}
      </Box>
    </Modal>
  );
}
