import React, { useState } from 'react';
import { SettingsSidebar } from '../../app/components/Settings/SettingsSidebar';
import styles from './/styles/globalSettings.module.scss';
const General = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className={styles.container}>
      <SettingsSidebar />
      <h1 className={styles.h1Tag}>General</h1>
    </div>
  );
};

export default General;
