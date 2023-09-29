import React, {useState} from 'react';
import { SettingsSidebar } from "@/app/components/SettingsSidebar";
import styles from './/styles/globalSettings.module.scss'
const Profile = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    return (
        <div className={styles.container}>
            <SettingsSidebar />
            <h1 className={styles.h1Tag}>Profile</h1>
            <h2>Manage your profile settings for Verbano</h2>
            <section>
                <label>
                    <input type="text"/>
                    Full Name
                </label>
                <label>
                    <input type="text"/>
                    Email
                </label>
                <label>
                    <input type="password"/>
                    Password
                </label>
                <h3>Danger Zone</h3>
                <button>Delete Account</button>
            </section>
        </div>
    )
}

export default Profile;