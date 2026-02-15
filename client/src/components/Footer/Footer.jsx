import styles from './Footer.module.scss';

export default function Footer() {
  return (
    <footer id="footer" className={styles.footer}>
      <p>The Boat Library &copy; {new Date().getFullYear()}</p>
    </footer>
  );
}
