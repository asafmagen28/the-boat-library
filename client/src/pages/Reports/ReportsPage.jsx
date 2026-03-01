import { useBestSellers } from '../../services/reports.api';
import PageHeader from '../../components/PageHeader/PageHeader';
import EmptyState from '../../components/EmptyState/EmptyState';
import styles from './ReportsPage.module.scss';

export default function ReportsPage() {
  const { data: books = [], isLoading, error } = useBestSellers();

  if (isLoading) return <p>Loading report...</p>;
  if (error) return <p id="reports-error">Error: {error.message}</p>;

  return (
    <section id="reports-page">
      <PageHeader id="reports-page-header" title="Reports" subtitle="Library analytics and reports" />

      <div className={styles.section}>
        <h2 id="best-sellers-section" className={styles.sectionTitle}>
          Best Sellers — Top 10 Most Borrowed Books
        </h2>

        {books.length === 0 ? (
          <EmptyState id="best-sellers-empty-state" message="No loan data recorded yet." icon="📊" />
        ) : (
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
    </section>
  );
}
