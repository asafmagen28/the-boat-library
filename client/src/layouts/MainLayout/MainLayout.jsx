import { Outlet } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import styles from './MainLayout.module.scss';

export default function MainLayout() {
  return (
    <div id="main-layout" className={styles.layout}>
      <Navbar />
      <main id="main-content" className={styles.main}>
        <div className={styles.content}>
          <Outlet />
        </div>
        <Footer />
      </main>
    </div>
  );
}
