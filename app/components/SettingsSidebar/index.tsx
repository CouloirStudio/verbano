import styles from './settingsSidebar.module.scss';
import { useRouter } from 'next/router';
import Link from 'next/link';

export const SettingsSidebar = () => {
    const route = useRouter();

    interface DummyUserInterface {
        firstName: string,
        lastName: string,
        password: string,
        email: string,
        isActive: boolean,
    }

    const DummyUser: DummyUserInterface = {
        firstName: 'User',
        lastName: 'User',
        password: '1234',
        email: 'user@gmail.com',
        isActive: true
    }

    const settingsOptions: string[] = [
        'Go Back',
        // `${DummyUser.firstName}  ${DummyUser.lastName}`,
        // 'Profile',
        'General',
        // 'Appearance',
        //'Security',
        'Login Credentials',
        // 'Two-Factor Authentication',
        // 'Billing',
        // 'Manage Billing',
        'Delete Account',
        'Logout',
    ];

    return (
        <div className={`${styles.container} ${styles.fullHeight}`}>
            {settingsOptions.map((settingsOption, index) => (
                <ul key={index} className={styles.customUl}>
                    {index === 1 || index === 5 || index === 8 ? (
                        <li className={`${styles.nonClickable} ${styles.nonClickableLI}`}>
                            {settingsOption}
                        </li>
                    ) : (
                        <li>
                            <Link
                                href={index === 0 ? '/' : `/settings/${settingsOption.toLowerCase()}`}
                            >
                                    {settingsOption}
                            </Link>
                        </li>
                    )}
                </ul>
            ))}
        </div>
    );
};
