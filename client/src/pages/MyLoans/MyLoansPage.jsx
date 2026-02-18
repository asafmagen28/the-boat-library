import { useMyLoans } from '../../services/api';
import PageHeader from '../../components/PageHeader/PageHeader';
import styles from './MyLoansPage.module.scss';

export default function MyLoansPage() {
  const { data: loans = [], isLoading, error } = useMyLoans();

  if (isLoading) return <p>Loading your loans...</p>;
  if (error) return <p id="my-loans-error">Error: {error.message}</p>;

  return (
    <section id="my-loans-page">
      <PageHeader id="my-loans-page-header" title="My Loans" subtitle="View and manage your active loans" />

      <div className={styles.list}>
        {loans.map((loan) => {
          const isActive = !loan.returnDate;
          return (
            <div key={loan.id} id={`my-loan-item-${loan.id}`} className={styles.loanItem}>
              <div className={styles.loanInfo}>
                <h3 className={styles.bookTitle}>{loan.copy?.book?.title}</h3>
                <p className={styles.detail}>
                  Author: {loan.copy?.book?.author?.firstName} {loan.copy?.book?.author?.surname}
                </p>
                <p className={styles.detail}>Loan Date: {loan.loanDate}</p>
                <p className={styles.detail}>Deadline: {loan.deadLineDate}</p>
                {loan.returnDate && (
                  <p className={styles.detail}>Returned: {loan.returnDate}</p>
                )}
              </div>
              <span className={`${styles.badge} ${isActive ? styles.active : styles.returned}`}>
                {isActive ? 'Active' : 'Returned'}
              </span>
            </div>
          );
        })}
      </div>

      {loans.length === 0 && <p className={styles.empty}>You have no loans yet.</p>}
    </section>
  );
}
