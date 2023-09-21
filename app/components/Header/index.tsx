import styles from './header.module.scss';
import dynamic from 'next/dynamic';

const Recorder = dynamic(() => import('../../components/Recorder'), {
  ssr: false,
});

function Header() {
  return (
    <div className={styles.header}>
      <Recorder />
    </div>
  );
}

export default Header;
