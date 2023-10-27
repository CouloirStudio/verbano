import styles from './scrollView.module.scss';

function ScrollView({ children }: { children: React.ReactNode }) {
  return <div className={styles.scrollView}>{children}</div>;
}

export default ScrollView;
