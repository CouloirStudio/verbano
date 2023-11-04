import React from 'react';
import { IconButton, Tooltip } from '@mui/material';

interface TooltipIconButtonProps {
  title: string;
  onClick?: () => void;
  icon: React.ReactElement;
  className?: string;
}

const TooltipIconButton: React.FC<TooltipIconButtonProps> = ({
  title,
  onClick,
  icon,
  className,
}) => {
  return (
    <Tooltip title={title}>
      <IconButton onClick={onClick} className={className}>
        {icon}
      </IconButton>
    </Tooltip>
  );
};

export default TooltipIconButton;
