import styles from './PageHeader.module.scss';

export default function PageHeader({ id, title, subtitle }) {
  return (
    <header id={id} className={styles.header}>
      <h1 className={styles.title}>{title}</h1>
      {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
    </header>
  );
}
