import React from 'react';
import { IconButton, Tooltip } from '@mui/material';

interface TooltipIconButtonProps {
  title: string;
  onClick?: () => void;
  icon: React.ReactElement;
  className?: string;
}

/**
 *  A re-usable icon button that contains a tooltip.
 * @param title the tool tip text
 * @param onClick function for when the button is clicked
 * @param icon the icon of the button
 * @param className the styles for the button
 */
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
