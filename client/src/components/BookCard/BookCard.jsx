import styles from './BookCard.module.scss';

function BookCard({ book, onClick }) {
  // Destructure book properties with defaults for skeleton structure
  const {
    title = 'Unknown Title',
    isbn = 'N/A',
    publicationYear,
    Author,
    availableCopies = 0
  } = book || {};

  // Format author name from Author object (firstName + lastName)
  const authorName = Author
    ? `${Author.firstName} ${Author.lastName}`.trim()
    : 'Unknown Author';

  // Determine availability status for styling
  const isAvailable = availableCopies > 0;

  return (
    <div
      id={book?.id ? `book-card-${book.id}` : undefined}
      className={styles.bookCard}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {/* Book Title - Main heading */}
      <h3 className={styles.title}>{title}</h3>

      {/* Author Information */}
      <p className={styles.author}>by {authorName}</p>

      {/* Book Details Section */}
      <div className={styles.details}>
        <div className={styles.detailItem}>
          <span className={styles.label}>ISBN:</span>
          <span className={styles.value}>{isbn}</span>
        </div>

        {publicationYear && (
          <div className={styles.detailItem}>
            <span className={styles.label}>Published:</span>
            <span className={styles.value}>{publicationYear}</span>
          </div>
        )}
      </div>

      {/* Availability Badge */}
      <div className={styles.availability}>
        <span className={`${styles.badge} ${isAvailable ? styles.available : styles.unavailable}`}>
          {isAvailable ? `${availableCopies} available` : 'Not available'}
        </span>
      </div>
    </div>
  );
}

export default BookCard;
