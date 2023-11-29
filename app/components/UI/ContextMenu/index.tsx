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

/**
 * This is a functional component that allows the user to access a context menu.
 * @param contextMenu the option for opening the context menu
 * @param handleClose function for closing the menu
 * @param options the items in the menu
 */
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
