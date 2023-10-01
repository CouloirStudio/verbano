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

import classes from './settingsSidebar.module.scss';
import styles from './settingsSidebar.module.scss';
import { CURRENT_USER_QUERY } from '../../../graphql/queries/getUsers';

/**
 * SettingsSidebar is a React component that displays a sidebar with navigation options.
 *
 * @component
 * @example
 * // Usage of SettingsSidebar component in a parent component
 * import { SettingsSidebar } from './SettingsSidebar';
 * // ...
 * <SettingsSidebar />
 */
export const SettingsSidebar: React.FC = () => {
  // State to store the user's first name.
  const [firstName, setFirstName] = useState('');

  // Access the Next.js router.
  const route: NextRouter = useRouter();

  // Query for fetching the current user data.
  const { loading, error, data } = useQuery(CURRENT_USER_QUERY);

  // Update the 'firstName' state once user data is loaded.
  useEffect(() => {
    if (!loading && !error && data && data.currentUser) {
      const currentUser = data.currentUser;
      setFirstName(currentUser.firstName);
    }
  }, [loading, error, data]);

  // Define the settings navigation options.
  const settingsOptions: string[] = [
    `Welcome ${firstName}`,
    'Back to Home',
    'Profile',
    // 'General',
    // 'Appearance',
    // 'Security',
    // 'Two-Factor Authentication',
    // 'Billing',
    // 'Manage Billing',
    // 'Delete Account',
    'Logout',
  ];

  /**
   * Retrieves an icon component based on the provided index.
   *
   * @param {number} index - The index of the settings option.
   * @returns {ReactNode | null} Icon component or null if no match is found.
   */
  function getIconByIndex(index: number): ReactNode | null {
    switch (index) {
      case 0:
        return <AiOutlineUser className={classes.icon} />;
      case 1:
        return <AiOutlineHome className={classes.icon} />;
      case 2:
        return <AiOutlineProfile className={classes.icon} />;
      case 3:
        return <AiOutlineLogout className={classes.icon} />;
      default:
        return null;
    }
  }

  return (
    <div className={`${styles.container} ${styles.fullHeight}`}>
      {settingsOptions.map((settingsOption, index) => (
        <ul key={index} className={styles.customUl}>
          <li
            className={`${index === 0 ? classes.nonClickableLI : ''} ${
              index === 0 ? classes.nonClickableLink : ''
            }`}
          >
            {index === 0 ? (
              // Displaying the "Welcome" message differently.
              <div className={styles.linkContainer}>
                {settingsOption}
                {getIconByIndex(index)}
              </div>
            ) : (
              // Generating links for other options.
              <Link
                href={
                  index === 1
                    ? '/'
                    : `/settings/${settingsOption.toLowerCase()}`
                }
                className={styles.link}
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
