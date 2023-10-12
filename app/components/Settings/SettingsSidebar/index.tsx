import Link from 'next/link';
import {NextRouter, useRouter} from 'next/router';
import React, {ReactNode} from 'react';
import {AiOutlineHome, AiOutlineLogout, AiOutlineProfile, AiOutlineUser} from 'react-icons/ai';
import styles from './settingsSidebar.module.scss';
import {useErrorModalContext} from '../../../contexts/ErrorModalContext';
import {useUser} from "../../UserProvider";

export const SettingsSidebar: React.FC = () => {
  const route: NextRouter = useRouter();
  const {setErrorMessage, setIsError} = useErrorModalContext();
  const currentUser = useUser();

  if (!currentUser) {
    setErrorMessage('An error occurred while fetching user data.');
    setIsError(true);
    return null;  // You can return an error component or null
  }

  const settingsOptions: string[] = [
    `Welcome ${currentUser.firstName} ${currentUser.lastName} Email ${currentUser.email}`,
    'Back to Home',
    'Profile',
    'Logout',
  ];

  function getIconByIndex(index: number): ReactNode | null {
    switch (index) {
      case 0:
        return <AiOutlineUser className={styles.icon}/>;
      case 1:
        return <AiOutlineHome className={styles.icon}/>;
      case 2:
        return <AiOutlineProfile className={styles.icon}/>;
      case 3:
        return <AiOutlineLogout className={styles.icon}/>;
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
                    ? '/' : index === 3 ? '/logout'
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
