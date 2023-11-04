import Link from "next/link";
import React, { ReactNode } from "react";
import { AiOutlineHome, AiOutlineLogout, AiOutlineProfile, AiOutlineUser } from "react-icons/ai";
import styles from "./settingsSidebar.module.scss";
import { useErrorModalContext } from "@/app/contexts/ErrorModalContext";
import { useUser } from "@/app/contexts/UserContext";

/**
 * `SettingsSidebar` is a React functional component that provides a sidebar for user settings.
 *
 * It displays user information and navigation links to various settings options.
 *
 * @remarks
 * This component uses data from the `GetCurrentUser` to display the user's first name, last name, and email.
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
  const { setErrorMessage, setIsError } = useErrorModalContext();
  const currentUser = useUser();

  if (!currentUser) {
    setErrorMessage('An error occurred while fetching user data.');
    setIsError(true);
    return null; // You can return an error component or null
  }

  // Define the available settings options
  const settingsOptions: string[] = [
    `Welcome ${currentUser.firstName} ${currentUser.lastName} Email ${currentUser.email}`,
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
                    : index === 3
                    ? '/logout'
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
