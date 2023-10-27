// ContextMenuComponent.tsx
import React from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

type ContextMenuOption = {
  label: string;
  action: () => void;
};

type ContextMenuProps = {
  contextMenu: { mouseX: number; mouseY: number } | null;
  handleClose: () => void;
  options: ContextMenuOption[];
};

export const ContextMenuComponent: React.FC<ContextMenuProps> = ({
  contextMenu,
  handleClose,
  options,
}) => {
  return (
    <Menu
      open={contextMenu !== null}
      onClose={handleClose}
      anchorReference="anchorPosition"
      anchorPosition={
        contextMenu !== null
          ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
          : undefined
      }
    >
      {options.map((option) => (
        <MenuItem
          key={option.label}
          onClick={() => {
            option.action();
            handleClose();
          }}
        >
          {option.label}
        </MenuItem>
      ))}
    </Menu>
  );
};
