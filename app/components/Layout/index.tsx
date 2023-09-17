import Header from '../Header';
import Sidebar from '../Sidebar';
import styles from './layout.module.scss';
import { ErrorModalContextProvider } from '@/app/contexts/ErrorModalContext';
import ErrorModal from '@/app/components/ErrorModal';

interface LayoutProps {
  children: React.ReactNode;
  noHeaderSidebar?: boolean;
}

function Layout({ children, noHeaderSidebar }: LayoutProps) {
  return (
    <ErrorModalContextProvider>
      <div className={styles.layoutContainer}>
        {!noHeaderSidebar && <ErrorModal />}
        {!noHeaderSidebar && <Header />}
        <div className={styles.contentArea}>
          {!noHeaderSidebar && <Sidebar />}
          <main>{children}</main>
        </div>
      </div>
    </ErrorModalContextProvider>
  );
}

export default Layout;
