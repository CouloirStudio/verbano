import styles from './sidebar.module.scss';

function Sidebar() {
  return (
    <div className={styles.sidebar}>
      <h1>Sidebar Content</h1>
      <ul>
        <li>Item 1</li>
        <li>Item 2</li>
      </ul>
    </div>
  );
}

export default Sidebar;
