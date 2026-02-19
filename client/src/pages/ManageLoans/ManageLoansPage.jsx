import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '../../services/api';
import { useAllLoans, useReturnLoan } from '../../services/loans.api';
import PageHeader from '../../components/PageHeader/PageHeader';
import Button from '../../components/Button/Button';
import ConfirmModal from '../../components/ConfirmModal/ConfirmModal';
import styles from './ManageLoansPage.module.scss';

export default function ManageLoansPage() {
  const queryClient = useQueryClient();
  const [loanToReturn, setLoanToReturn] = useState(null);
  const { data: loans = [], isLoading, error } = useAllLoans();

  const returnLoan = useReturnLoan({
    onSuccess: (_response, returnedLoanId) => {
      queryClient.setQueryData(QUERY_KEYS.loans, (old = []) =>
        old.filter((loan) => loan.id !== returnedLoanId)
      );
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.books });
      setLoanToReturn(null);
    },
  });

  if (isLoading) return <p>Loading loans...</p>;
  if (error) return <p id="manage-loans-error">Error: {error.message}</p>;

  return (
    <section id="manage-loans-page">
      <PageHeader id="manage-loans-page-header" title="Manage Loans" subtitle="Process loans and returns" />

      {returnLoan.error && <p id="return-loan-error" className={styles.error}>{returnLoan.error.message}</p>}

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

      {loans.length === 0 && <p className={styles.empty}>No active loans.</p>}

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
