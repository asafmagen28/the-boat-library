import { Outlet } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import Sidebar from '../../components/Sidebar/Sidebar';
import Footer from '../../components/Footer/Footer';
import styles from './MainLayout.module.scss';

export default function MainLayout() {
  return (
    <div className={styles.layout}>
      <Navbar />
      <Sidebar />
      <main className={styles.main}>
        <div className={styles.content}>
          <Outlet />
        </div>
        <Footer />
      </main>
    </div>
  );
}
