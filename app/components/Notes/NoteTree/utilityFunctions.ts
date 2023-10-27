import { Theme } from '@mui/material/styles';

export const getItemStyle = (
  draggableStyle: any,
  isDragging: boolean,
  theme: Theme,
) => ({
  userSelect: 'none',
  background: isDragging
    ? theme.palette.primary.main ?? ''
    : theme.custom?.mainBackground ?? '',
  ...draggableStyle,
});
