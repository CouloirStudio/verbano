import Header from '../Header';
import Sidebar from '../Sidebar';
import styles from './layout.module.scss';

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.layoutContainer}>
      <Header />
      <div className={styles.contentArea}>
        <Sidebar />
        <main>{children}</main>
      </div>
    </div>
  );
}

export default Layout;
