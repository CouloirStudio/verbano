import styles from './header.module.scss';
import Recorder from '../Recorder'; 

function Header() {
  return (
    <div className={styles.header}>
      <Recorder />
    </div>
  );
}

export default Header;
