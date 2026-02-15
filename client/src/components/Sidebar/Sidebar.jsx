import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styles from './Sidebar.module.scss';

const customerLinks = [
  { section: 'Browse', links: [
    { to: '/books', label: 'Books' },
    { to: '/authors', label: 'Authors' },
  ]},
  { section: 'My Account', links: [
    { to: '/my-loans', label: 'My Loans' },
    { to: '/budget', label: 'Budget' },
  ]},
];

const employeeLinks = [
  { section: 'Browse', links: [
    { to: '/books', label: 'Books' },
    { to: '/authors', label: 'Authors' },
  ]},
  { section: 'Management', links: [
    { to: '/manage/loans', label: 'Manage Loans' },
    { to: '/manage/customers', label: 'Customers' },
  ]},
  { section: 'Analytics', links: [
    { to: '/reports', label: 'Reports' },
  ]},
];

export default function Sidebar() {
  const { user } = useAuth();
  const sections = user?.roleName === 'employee' ? employeeLinks : customerLinks;

  return (
    <aside className={styles.sidebar}>
      {sections.map((section) => (
        <div key={section.section} className={styles.section}>
          <h4 className={styles.sectionTitle}>{section.section}</h4>
          <ul>
            {section.links.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  className={({ isActive }) =>
                    `${styles.link} ${isActive ? styles.active : ''}`
                  }
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </aside>
  );
}
