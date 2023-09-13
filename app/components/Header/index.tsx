import styles from './header.module.scss';
//import Recorder from '../Recorder';
import dynamic from "next/dynamic";

const Recorder = dynamic(
    () => import("../Recorder"),
    { ssr: false }
);
function Header() {
  return (
    <div className={styles.header}>
      <Recorder />
    </div>
  );
}

export default Header;
