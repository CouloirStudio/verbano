import React from 'react';
import Link from 'next/link';
import styles from '../../styles/pages/index.module.scss';

const Header: React.FC = () => (
	<header className={styles.header}>
		<Link href='/' passHref>
			<h1 className={styles.title}>Verbano</h1>
		</Link>
	</header>
);

export default Header;
