import styles from './Pagination.module.scss';

function getPageNumbers(currentPage, totalPages) {
  const pages = [];
  const delta = 1;
  const left = Math.max(2, currentPage - delta);
  const right = Math.min(totalPages - 1, currentPage + delta);

  pages.push(1);
  if (left > 2) pages.push('...');
  for (let i = left; i <= right; i++) pages.push(i);
  if (right < totalPages - 1) pages.push('...');
  if (totalPages > 1) pages.push(totalPages);

  return pages;
}

export default function Pagination({ currentPage, totalPages, onPageChange, id = 'pagination', isDisabled = false }) {
  if (totalPages <= 1) return null;

  const pages = getPageNumbers(currentPage, totalPages);

  return (
    <nav id={id} className={styles.pagination} aria-label="Pagination">
      <button
        id={`${id}-prev-btn`}
        className={styles.button}
        onClick={() => onPageChange(currentPage - 1)}
        disabled={isDisabled || currentPage <= 1}
      >
        Previous
      </button>

      {pages.map((page, index) =>
        page === '...' ? (
          <span key={`ellipsis-${index}`} className={styles.ellipsis}>...</span>
        ) : (
          <button
            key={page}
            id={`${id}-page-${page}`}
            className={`${styles.button} ${page === currentPage ? styles.active : ''}`}
            onClick={() => onPageChange(page)}
            disabled={isDisabled || page === currentPage}
          >
            {page}
          </button>
        )
      )}

      <button
        id={`${id}-next-btn`}
        className={styles.button}
        onClick={() => onPageChange(currentPage + 1)}
        disabled={isDisabled || currentPage >= totalPages}
      >
        Next
      </button>
    </nav>
  );
}
