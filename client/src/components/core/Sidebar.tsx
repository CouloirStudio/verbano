import React from 'react';
import Link from 'next/link';
import styles from '../../styles/pages/index.module.scss';

const Sidebar: React.FC = () => {
	const pageTitles = ['Page 1', 'Page 2', 'Page 3'];

	return (
		<div className={styles.sidebar}>
			<ul className={styles['page-list']}>
				{pageTitles.map((pageTitle, index) => (
					<li key={index} className={styles['page-item']}>
						<Link href={`/page${index + 1}`} className='page-link' passHref>
							{pageTitle}
						</Link>
					</li>
				))}
			</ul>
		</div>
	);
};

export default Sidebar;
