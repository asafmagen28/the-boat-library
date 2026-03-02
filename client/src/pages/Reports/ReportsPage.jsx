import { useState } from 'react';
import { useBestSellers, useAuthorPayments } from '../../services/reports.api';
import PageHeader from '../../components/PageHeader/PageHeader';
import EmptyState from '../../components/EmptyState/EmptyState';
import styles from './ReportsPage.module.scss';

export default function ReportsPage() {
  const [activeReport, setActiveReport] = useState('best-sellers');

  const { data: books = [], isLoading: bsLoading, error: bsError } = useBestSellers();
  const {
    data: authors = [],
    isLoading: apLoading,
    error: apError,
  } = useAuthorPayments({ enabled: activeReport === 'author-payments' });

  return (
    <section id="reports-page">
      <PageHeader id="reports-page-header" title="Reports" subtitle="Library analytics and reports" />

      <div className={styles.tabs}>
        <button
          id="reports-tab-best-sellers"
          className={`${styles.tab} ${activeReport === 'best-sellers' ? styles.tabActive : ''}`}
          onClick={() => setActiveReport('best-sellers')}
        >
          Best Sellers
        </button>
        <button
          id="reports-tab-author-payments"
          className={`${styles.tab} ${activeReport === 'author-payments' ? styles.tabActive : ''}`}
          onClick={() => setActiveReport('author-payments')}
        >
          Author Payments
        </button>
      </div>

      {activeReport === 'best-sellers' && (
        <div id="best-sellers-section" className={styles.section}>
          <h2 className={styles.sectionTitle}>Best Sellers — Top 10 Most Borrowed Books</h2>

          {bsLoading && <p>Loading report...</p>}
          {bsError && <p id="reports-error">Error: {bsError.message}</p>}
          {!bsLoading && !bsError && books.length === 0 && (
            <EmptyState id="best-sellers-empty-state" message="No loan data recorded yet." icon="📊" />
          )}
          {!bsLoading && !bsError && books.length > 0 && (
            <ol className={styles.list}>
              {books.map((book, index) => (
                <li key={book.id} id={`best-seller-item-${book.id}`} className={styles.item}>
                  <span id={`best-seller-rank-${book.id}`} className={styles.rank}>
                    #{index + 1}
                  </span>
                  <div className={styles.bookInfo}>
                    <span className={styles.title}>{book.title}</span>
                    <span className={styles.author}>
                      {book.author?.firstName} {book.author?.surname}
                    </span>
                  </div>
                  <span id={`best-seller-count-${book.id}`} className={styles.loanCount}>
                    {parseInt(book.loanCount, 10)} loans
                  </span>
                </li>
              ))}
            </ol>
          )}
        </div>
      )}

      {activeReport === 'author-payments' && (
        <div id="author-payments-section" className={styles.section}>
          <h2 className={styles.sectionTitle}>Author Payments — Loan Fee Summary</h2>

          {apLoading && <p>Loading report...</p>}
          {apError && <p id="reports-error">Error: {apError.message}</p>}
          {!apLoading && !apError && authors.length === 0 && (
            <EmptyState id="author-payments-empty-state" message="No authors found." icon="📊" />
          )}
          {!apLoading && !apError && authors.length > 0 && (
            <ol className={styles.list}>
              {authors.map((author, index) => (
                <li key={author.id} id={`author-payment-item-${author.id}`} className={styles.item}>
                  <span id={`author-payment-rank-${author.id}`} className={styles.rank}>
                    #{index + 1}
                  </span>
                  <div className={styles.bookInfo}>
                    <span className={styles.title}>
                      {author.firstName} {author.surname}
                    </span>
                  </div>
                  <span id={`author-payment-loans-${author.id}`} className={styles.loanCount}>
                    {parseInt(author.loanCount, 10) || 0} loans
                  </span>
                  <span id={`author-payment-amount-${author.id}`} className={styles.paymentAmount}>
                    ₪{parseFloat(author.totalPayment || 0).toFixed(2)}
                  </span>
                </li>
              ))}
            </ol>
          )}
        </div>
      )}
    </section>
  );
}
