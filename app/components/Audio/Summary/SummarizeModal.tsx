import React, { useState } from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import ButtonBase from '@mui/material/ButtonBase';
import TextField from '@mui/material/TextField';
import { useGenerateSummary } from '@/app/hooks/useSummaryGeneration';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 'auto', // Adjust based on your content
  maxWidth: '80vw', // Max width of modal
  bgcolor: 'background.paper',
  borderRadius: 2, // Added border radius for a subtle rounded corner
  boxShadow: 24,
  p: 4,
};

function SummarizeModal({ open, handleClose }: any) {
  const BASE_URL = 'https://localhost:3000';

  const generateSummary = useGenerateSummary(BASE_URL);

  const [selectedAction, setSelectedAction] = useState<string | null>(null);

  const [showCustomInput, setShowCustomInput] = useState(false);

  const [prompt, setPrompt] = useState<string>('');

  const handleActionClick = (action: string) => {
    setSelectedAction(action);
    setPrompt('');
    setShowCustomInput(action === 'custom');
  };

  const handleGenerateSummary = () => {
    if (selectedAction === 'custom' && prompt === '') {
      generateSummary(prompt);
      setPrompt('');
    } else {
      generateSummary();
    }
    handleClose();
  };

  const isSelected = (action: string) => selectedAction === action;

  const buttonStyle = (action: string) => ({
    width: '100%',
    display: 'block',
    textAlign: 'left',
    position: 'relative',
    border: 1,
    borderColor: 'grey.300',
    borderRadius: 2,
    p: 2,
    bgcolor: isSelected(action) ? 'primary.light' : 'background.paper',
    transition: 'all 0.2s ease-in-out',
    '&:hover': {
      bgcolor: isSelected(action) ? 'primary.main' : 'grey.200',
    },
  });

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        <Typography
          variant="h6"
          component="h2"
          textAlign="center"
          marginBottom={2}
        >
          Create New Summary
        </Typography>
        <Stack direction="row" spacing={2} justifyContent="center">
          <ButtonBase
            onClick={() => handleActionClick('summary')}
            sx={buttonStyle('summary')}
          >
            <Typography variant="subtitle1" gutterBottom>
              Summary 📄
            </Typography>
            <Typography variant="body2">
              Automatically generate a concise summary
            </Typography>
          </ButtonBase>

          <ButtonBase
            onClick={() => handleActionClick('action-items')}
            sx={buttonStyle('action-items')}
          >
            <Typography variant="subtitle1" gutterBottom>
              Action items 🔥
            </Typography>
            <Typography variant="body2">
              Get a list of actionable items to help you know what to do next
            </Typography>
          </ButtonBase>

          <ButtonBase
            onClick={() => handleActionClick('custom')}
            sx={buttonStyle('custom')}
          >
            <Typography variant="subtitle1" gutterBottom>
              Custom ✍️
            </Typography>
            <Typography variant="body2">
              Write your own prompt to get exactly what you want
            </Typography>
          </ButtonBase>
        </Stack>
        {showCustomInput && (
          <Box mt={2}>
            <TextField
              fullWidth
              label="Prompt Input"
              variant="outlined"
              placeholder="How would you like this summarized.."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
          </Box>
        )}
        <Stack direction="row" justifyContent="center" marginTop={4}>
          <Button variant="contained" onClick={handleGenerateSummary}>
            Generate
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
}

export default SummarizeModal;
