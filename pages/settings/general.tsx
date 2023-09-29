import React from 'react';
import { SettingsSidebar } from "@/app/components/SettingsSidebar";
import styles from './/styles/globalSettings.module.scss'
const General = () => {
    return (
        <div className={styles.container}>
            <SettingsSidebar />
            <h1 className={styles.h1Tag}>General</h1>
        </div>
    )
}

export default General;