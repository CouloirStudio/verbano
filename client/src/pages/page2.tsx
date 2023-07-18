import React from 'react';
import styles from '../styles/pages/index.module.scss';
import Layout from '../components/core/Layout';

const Home: React.FC = () => (
	<Layout>
		<div className={styles.container}>
			<div className={styles.main}>
				<h1>Welcome to Page 2</h1>
			</div>
		</div>
	</Layout>
);

export default Home;
