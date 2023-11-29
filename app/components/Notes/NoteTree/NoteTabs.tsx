import React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import useStyles from './NoteTreeStyles';
import { useTheme } from '@mui/material/styles';

interface NoteTabsProps {
  activeTab: number;
  setActiveTab: React.Dispatch<React.SetStateAction<number>>;
}

/**
 * NoteTabs is a component that allows the user to toggle between viewing notes and summaries.
 * @param activeTab the currently active tab
 * @param setActiveTab sets the currently active tab
 */
const NoteTabs: React.FC<NoteTabsProps> = ({ activeTab, setActiveTab }) => {
  const classes = useStyles();
  const theme = useTheme();

  return (
    <Tabs
      value={activeTab}
      onChange={(event, newValue) => setActiveTab(newValue)}
      className={classes.tabsContainer}
      style={{
        backgroundColor: theme.custom?.mainBackground ?? '',
      }}
      TabIndicatorProps={{ style: { display: 'none' } }}
    >
      <Tab
        label="Notes"
        className={classes.tabItem}
        style={{
          color: theme.custom?.text ?? '',
        }}
      />
      <Tab
        label="Summaries"
        className={classes.tabItem}
        style={{
          color: theme.custom?.text ?? '',
        }}
      />
    </Tabs>
  );
};

export default NoteTabs;
