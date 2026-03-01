import { useState } from 'react';
import { useToast } from '../../context/ToastContext';
import { useAllLoans, useReturnLoan } from '../../services/loans.api';
import PageHeader from '../../components/PageHeader/PageHeader';
import Button from '../../components/Button/Button';
import ConfirmModal from '../../components/ConfirmModal/ConfirmModal';
import EmptyState from '../../components/EmptyState/EmptyState';
import styles from './ManageLoansPage.module.scss';

export default function ManageLoansPage() {
  const { showToast } = useToast();
  const [loanToReturn, setLoanToReturn] = useState(null);
  const { data: loans = [], isLoading, error } = useAllLoans();

  const returnLoan = useReturnLoan({
    // Override only the UI-specific behaviors
    // Cache management is now handled automatically by the service
    onError: (error) => {
      setLoanToReturn(null);
      showToast(error.message, 'error');
    },
    onSuccess: () => {
      setLoanToReturn(null);
      showToast('Book returned successfully', 'success');
    },
  });

  if (isLoading) return <p>Loading loans...</p>;
  if (error) return <p id="manage-loans-error">Error: {error.message}</p>;

  return (
    <section id="manage-loans-page">
      <PageHeader id="manage-loans-page-header" title="Manage Loans" subtitle="Process loans and returns" />

      <div className={styles.list}>
        {loans.map((loan) => (
          <div key={loan.id} id={`loan-item-${loan.id}`} className={styles.loanItem}>
            <div className={styles.loanInfo}>
              <h3 className={styles.bookTitle}>{loan.copy?.book?.title}</h3>
              <p className={styles.detail}>
                Author: {loan.copy?.book?.author?.firstName} {loan.copy?.book?.author?.surname}
              </p>
              <p className={styles.detail}>Borrower: {loan.borrower?.username}</p>
              <p className={styles.detail}>Loan Date: {loan.loanDate}</p>
              <p className={styles.detail}>Deadline: {loan.deadLineDate}</p>
            </div>
            <Button
              id={`loan-return-btn-${loan.id}`}
              variant="primary"
              onClick={() => setLoanToReturn(loan)}
              disabled={returnLoan.isPending}
            >
              Return
            </Button>
          </div>
        ))}
      </div>

      {loans.length === 0 && <EmptyState id="manage-loans-empty-state" message="No active loans." icon="📚" />}

      <ConfirmModal
        id="return-loan-modal"
        isOpen={!!loanToReturn}
        title="Return Book"
        message={`Are you sure you want to return "${loanToReturn?.copy?.book?.title}" borrowed by ${loanToReturn?.borrower?.username}?`}
        confirmLabel="Return"
        confirmVariant="primary"
        onConfirm={() => returnLoan.mutate(loanToReturn.id)}
        onCancel={() => setLoanToReturn(null)}
      />
    </section>
  );
}
