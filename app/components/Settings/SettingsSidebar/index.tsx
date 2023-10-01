import Link from 'next/link';
import { useQuery } from '@apollo/client';
import { NextRouter, useRouter } from 'next/router';
import React, { ReactNode, useEffect, useState } from 'react';
import {
  AiOutlineUser,
  AiOutlineHome,
  AiOutlineProfile,
  AiOutlineLogout,
} from 'react-icons/ai';
import styles from './settingsSidebar.module.scss';
import { CURRENT_USER_QUERY } from '../../../graphql/queries/getUsers';
import { useErrorModalContext } from '../../../contexts/ErrorModalContext';

export const SettingsSidebar: React.FC = () => {
  const [firstName, setFirstName] = useState('');

  const route: NextRouter = useRouter();

  const { loading, error, data } = useQuery(CURRENT_USER_QUERY);

  const { setErrorMessage, setIsError } = useErrorModalContext();

  useEffect(() => {
    if (!loading && !error && data && data.currentUser) {
      const currentUser = data.currentUser;
      setFirstName(currentUser.firstName);
    } else if (error) {
      setErrorMessage('An error occurred while fetching user data.');
      setIsError(true);
    }
  }, [loading, error, data]);

  const settingsOptions: string[] = [
    `Welcome ${firstName}`,
    'Back to Home',
    'Profile',
    'Logout',
  ];

  function getIconByIndex(index: number): ReactNode | null {
    switch (index) {
      case 0:
        return <AiOutlineUser className={styles.icon} />;
      case 1:
        return <AiOutlineHome className={styles.icon} />;
      case 2:
        return <AiOutlineProfile className={styles.icon} />;
      case 3:
        return <AiOutlineLogout className={styles.icon} />;
      default:
        return null;
    }
  }

  return (
    <div className={`${styles.container} ${styles.fullHeight}`}>
      {settingsOptions.map((settingsOption, index) => (
        <ul key={index} className={styles.customUl}>
          <li className={`${index === 0 ? styles.nonClickableLI : ''}`}>
            {index === 0 ? (
              <div className={styles.linkContainer}>
                {settingsOption}
                {getIconByIndex(index)}
              </div>
            ) : (
              <Link
                href={
                  index === 1
                    ? '/'
                    : `/settings/${settingsOption.toLowerCase()}`
                }
              >
                <div className={styles.linkContainer}>
                  {settingsOption}
                  {getIconByIndex(index)}
                </div>
              </Link>
            )}
          </li>
        </ul>
      ))}
    </div>
  );
};
