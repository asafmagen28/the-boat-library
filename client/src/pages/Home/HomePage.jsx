import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import PageHeader from '../../components/PageHeader/PageHeader';
import styles from './HomePage.module.scss';

const customerCards = [
  { to: '/books', icon: '\uD83D\uDCDA', title: 'Browse Books', desc: 'Explore our full catalog of books' },
  { to: '/authors', icon: '\u270D\uFE0F', title: 'Browse Authors', desc: 'Discover authors and their works' },
  { to: '/my-loans', icon: '\uD83D\uDCCB', title: 'My Loans', desc: 'View and manage your active loans' },
  { to: '/budget', icon: '\uD83D\uDCB0', title: 'My Budget', desc: 'Check your balance and transactions' },
];

const employeeCards = [
  { to: '/books', icon: '\uD83D\uDCDA', title: 'Browse Books', desc: 'Manage the book catalog' },
  { to: '/authors', icon: '\u270D\uFE0F', title: 'Browse Authors', desc: 'Manage author records' },
  { to: '/manage/loans', icon: '\uD83D\uDD04', title: 'Manage Loans', desc: 'Process loans and returns' },
  { to: '/manage/customers', icon: '\uD83D\uDC65', title: 'Manage Customers', desc: 'View and manage customer accounts' },
  { to: '/reports', icon: '\uD83D\uDCCA', title: 'Reports', desc: 'View library analytics and reports' },
];

export default function HomePage() {
  const { user } = useAuth();
  const cards = user?.roleName === 'employee' ? employeeCards : customerCards;

  return (
    <section id="home-page">
      <PageHeader
        id="home-page-header"
        title={`Welcome, ${user?.username}!`}
        subtitle="What would you like to do today?"
      />
      <div className={styles.grid}>
        {cards.map((card) => (
          <Link key={card.to} id={`home-card-${card.to.replace(/\//g, '-').replace(/^-/, '')}`} to={card.to} className={styles.card}>
            <span className={styles.icon}>{card.icon}</span>
            <h3 className={styles.cardTitle}>{card.title}</h3>
            <p className={styles.cardDesc}>{card.desc}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
