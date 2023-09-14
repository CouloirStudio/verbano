import Header from '../Header';
import Sidebar from '../Sidebar';
import styles from './layout.module.scss';

interface LayoutProps {
  children: React.ReactNode;
  noHeaderSidebar?: boolean;
}

function Layout({ children, noHeaderSidebar }: LayoutProps) {
  return (
    <div className={styles.layoutContainer}>
      {!noHeaderSidebar && <Header />}
      <div className={styles.contentArea}>
        {!noHeaderSidebar && <Sidebar />}
        <main>{children}</main>
      </div>
    </div>
  );
}

export default Layout;
