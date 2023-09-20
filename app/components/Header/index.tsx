import styles from './header.module.scss';
import Recorder from '../Recorder';
import LogoutButton from "@/app/components/Logout";

function Header() {
  return (
    <div className={styles.header}>
      <Recorder/>
      <LogoutButton/>
    </div>
  );
}

export default Header;
