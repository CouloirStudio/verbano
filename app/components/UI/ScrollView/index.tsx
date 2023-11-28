import styles from "./scrollView.module.scss";

/**
 * ScrollView is a component used to make a component scrollable.
 * @param children children to be nexted in the div
 * @constructor
 */
function ScrollView({ children }: { children: React.ReactNode }) {
  return <div className={styles.scrollView}>{children}</div>;
}

export default ScrollView;
