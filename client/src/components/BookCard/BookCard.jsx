import styles from './BookCard.module.scss';
import Button from '../Button/Button';

function BookCard({ book, onBorrow, onDelete, canBorrow, canDelete }) {
  const {
    title = 'Unknown Title',
    author,
    price = 0,
    fee = 0,
    availableCopies = 0
  } = book || {};

  const authorName = author
    ? `${author.firstName} ${author.surname}`.trim()
    : 'Unknown Author';

  const isAvailable = availableCopies > 0;

  return (
    <div
      id={book?.id ? `book-card-${book.id}` : undefined}
      className={styles.bookCard}
    >
      <h3 className={styles.title}>{title}</h3>

      <p className={styles.author}>by {authorName}</p>

      <div className={styles.details}>
        <div className={styles.detailItem}>
          <span className={styles.label}>Price:</span>
          <span className={styles.value}>${Number(price).toFixed(2)}</span>
        </div>
        <div className={styles.detailItem}>
          <span className={styles.label}>Fee:</span>
          <span className={styles.value}>${Number(fee).toFixed(2)}</span>
        </div>
      </div>

      <div className={styles.availability}>
        <span className={`${styles.badge} ${isAvailable ? styles.available : styles.unavailable}`}>
          {isAvailable ? `${availableCopies} available` : 'Not available'}
        </span>
      </div>

      {(canBorrow || canDelete) && (
        <div className={styles.actions}>
          {canBorrow && isAvailable && (
            <Button
              id={`book-borrow-btn-${book.id}`}
              variant="primary"
              onClick={() => onBorrow(book.id)}
            >
              Borrow
            </Button>
          )}
          {canDelete && (
            <Button
              id={`book-delete-btn-${book.id}`}
              variant="danger"
              onClick={() => onDelete(book.id)}
            >
              Delete
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

export default BookCard;
