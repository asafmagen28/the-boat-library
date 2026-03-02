import PageHeader from '../../components/PageHeader/PageHeader';
import { useMyBudget, useMyTransactions } from '../../services/users.api';
import styles from './BudgetPage.module.scss';

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString();
}

function formatAmount(amount) {
  const prefix = amount >= 0 ? '+' : '-';
  return `${prefix} ₪${Math.abs(amount).toFixed(2)}`;
}

function getTransactionLabel(transaction) {
  if (transaction.transactionType?.type === 'deposit') return 'Deposit';
  if (transaction.transactionType?.type === 'borrow_charge') return 'Book Charge';
  return transaction.transactionType?.type ?? 'Transaction';
}

export default function BudgetPage() {
  const { data: budgetData, isLoading: budgetLoading, error: budgetError } = useMyBudget();
  const { data: transactions = [], isLoading: txLoading, error: txError } = useMyTransactions();

  const budget = budgetData?.budget ?? 0;

  return (
    <section id="budget-page">
      <PageHeader id="budget-page-header" title="Budget" subtitle="Check your balance and transactions" />

      {budgetLoading ? (
        <p>Loading balance...</p>
      ) : budgetError ? (
        <p>Error loading balance: {budgetError.message}</p>
      ) : (
        <div className={styles.balanceCard}>
          <p className={styles.balanceLabel}>Current Balance</p>
          <p
            id="budget-balance-display"
            className={`${styles.balanceAmount} ${budget >= 0 ? styles.balancePositive : styles.balanceNegative}`}
          >
            ₪{budget.toFixed(2)}
          </p>
        </div>
      )}

      <h2 className={styles.sectionTitle}>Transaction History</h2>

      {txLoading ? (
        <p>Loading transactions...</p>
      ) : txError ? (
        <p>Error loading transactions: {txError.message}</p>
      ) : transactions.length === 0 ? (
        <p className={styles.emptyState}>No transactions yet.</p>
      ) : (
        <ul id="transactions-list" className={styles.transactionList}>
          {transactions.map((tx) => (
            <li key={tx.id} id={`transaction-item-${tx.id}`} className={styles.transactionItem}>
              <div className={styles.transactionMeta}>
                <span className={styles.transactionType}>{getTransactionLabel(tx)}</span>
                {tx.loan?.copy?.book?.title && (
                  <span className={styles.bookTitle}>{tx.loan.copy.book.title}</span>
                )}
                <span className={styles.transactionDate}>{formatDate(tx.createdAt)}</span>
              </div>
              <span
                className={`${styles.transactionAmount} ${tx.amount >= 0 ? styles.amountPositive : styles.amountNegative}`}
              >
                {formatAmount(tx.amount)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
