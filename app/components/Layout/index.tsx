import Header from '../Header';
import Sidebar from '../Sidebar';
import User from '../User';
import styles from './layout.module.scss';
import LoginWithCredentials from "../Login";

interface LayoutProps {
  children: React.ReactNode;
  noHeaderSidebar?: boolean;
}

function Layout({children, noHeaderSidebar}: LayoutProps) {
  return (
    <div className={styles.layoutContainer}>
      {!noHeaderSidebar && <Header/>}
      <div className={styles.contentArea}>
        {!noHeaderSidebar && <Sidebar/>}
        <main>{children}</main>
        <User/>
        <LoginWithCredentials/>
      </div>
    </div>
  );
}

export default Layout;
