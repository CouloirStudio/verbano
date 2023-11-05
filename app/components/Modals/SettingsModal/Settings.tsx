import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import UpdateEmailForm from '@/app/components/Settings/UpdateEmailForm/UpdateEmailForm';
import UpdateNameForm from '@/app/components/Settings/UpdateNameForm/UpdateNameForm';
import UpdatePasswordForm from '@/app/components/Settings/UpdatePasswordForm/UpdatePasswordForm';
import { useUser } from '@/app/contexts/UserContext';
import styles from './settings.module.scss';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      className={styles.scroll}
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
  };
}

export default function Settings() {
  const [value, setValue] = React.useState(0);
  const currentUser = useUser();
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box
      sx={{
        flexGrow: 1,
        bgcolor: 'background.paper',
        display: 'flex',
        height: 224,
      }}
    >
      <Tabs
        orientation="vertical"
        variant="scrollable"
        value={value}
        onChange={handleChange}
        aria-label="Vertical tabs example"
        sx={{ borderRight: 1, borderColor: 'divider' }}
      >
        <Tab label="General" {...a11yProps(0)} />
        <Tab label="Privacy" {...a11yProps(1)} />
        <Tab label="Billing" {...a11yProps(2)} />
      </Tabs>
      <TabPanel value={value} index={0}>
        <UpdateEmailForm currentUser={currentUser} />
        <UpdateNameForm currentUser={currentUser} />
        <UpdatePasswordForm currentUser={currentUser} onChange={() => {}} />
      </TabPanel>
      <TabPanel value={value} index={1}></TabPanel>
      <TabPanel value={value} index={2}></TabPanel>
    </Box>
  );
}
