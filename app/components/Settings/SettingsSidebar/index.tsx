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

/**
 * `SettingsSidebar` is a React functional component that provides a sidebar for user settings.
 *
 * It displays user information and navigation links to various settings options.
 *
 * @remarks
 * This component uses data from the `CURRENT_USER_QUERY` to display the user's first name, last name, and email.
 *
 * @see {@link https://nextjs.org/ | Next.js} for routing capabilities.
 * @see {@link https://www.apollographql.com/docs/react/ | Apollo Client} for GraphQL queries.
 *
 * @example
 * ```tsx
 * <SettingsSidebar />
 * ```
 */
export const SettingsSidebar: React.FC = () => {
  // State for user information
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');

  // Access the Next.js router
  const route: NextRouter = useRouter();

  // Use Apollo Client to fetch user data
  const { loading, error, data } = useQuery(CURRENT_USER_QUERY);

  // Access the error modal context for displaying error messages
  const { setErrorMessage, setIsError } = useErrorModalContext();

  // Use an effect to populate user data when the component mounts
  useEffect(() => {
    if (!loading && !error && data && data.currentUser) {
      const currentUser = data.currentUser;
      setFirstName(currentUser.firstName);
      setLastName(currentUser.lastName)
      setEmail(currentUser.email)
    } else if (error) {
      setErrorMessage('An error occurred while fetching user data.');
      setIsError(true);
    }
  }, [loading, error, data]);

  // Define the available settings options
  const settingsOptions: string[] = [
    `Welcome ${firstName} ${lastName} Email ${email}`,
    'Back to Home',
    'Profile',
    'Logout',
  ];

  /**
   * Returns the icon associated with a specific settings option.
   *
   * @param {number} index - The index of the settings option.
   * @returns {ReactNode|null} The icon element or null if no icon is available.
   */
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
