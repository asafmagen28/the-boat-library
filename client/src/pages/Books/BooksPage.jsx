import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { ROLES } from '../../constants/roles';
import { QUERY_KEYS } from '../../services/api';
import { useBooks, useAddBook, useDeleteBook } from '../../services/books.api';
import { useBorrowBook } from '../../services/loans.api';
import { useAuthors } from '../../services/authors.api';
import PageHeader from '../../components/PageHeader/PageHeader';
import BookCard from '../../components/BookCard/BookCard';
import Button from '../../components/Button/Button';
import FormInput from '../../components/FormInput/FormInput';
import ConfirmModal from '../../components/ConfirmModal/ConfirmModal';
import styles from './BooksPage.module.scss';

export default function BooksPage() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const isEmployee = user?.roleId === ROLES.EMPLOYEE;
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [authorId, setAuthorId] = useState('');
  const [price, setPrice] = useState('');
  const [fee, setFee] = useState('');
  const [numberOfCopies, setNumberOfCopies] = useState('1');
  const [validationError, setValidationError] = useState('');
  const [activeModal, setActiveModal] = useState(null);
  const closeModal = () => setActiveModal(null);

  const { data: books = [], isLoading, error } = useBooks();
  const { data: authors = [] } = useAuthors({ enabled: showForm });

  const addBook = useAddBook({
    onSuccess: (response) => {
      const newBook = response.data;
      const author = authors.find((a) => a.id === newBook.authorId);
      queryClient.setQueryData(QUERY_KEYS.books, (old = []) => [
        ...old,
        { ...newBook, author, availableCopies: Number(numberOfCopies) || 1 },
      ]);
      setTitle('');
      setAuthorId('');
      setPrice('');
      setFee('');
      setNumberOfCopies('1');
      setShowForm(false);
    },
  });

  const deleteBook = useDeleteBook({
    onSuccess: (_response, deletedId) => {
      queryClient.setQueryData(QUERY_KEYS.books, (old = []) =>
        old.filter((book) => book.id !== deletedId)
      );
      closeModal();
      showToast('Book deleted successfully', 'success');
    },
    onError: (error) => {
      closeModal();
      showToast(error.message, 'error');
    },
  });

  const borrowBook = useBorrowBook({
    onSuccess: (_response, variables) => {
      queryClient.setQueryData(QUERY_KEYS.books, (old = []) =>
        old.map((book) =>
          book.id === variables.bookId
            ? { ...book, availableCopies: book.availableCopies - 1 }
            : book
        )
      );
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.myLoans });
      closeModal();
      showToast('Book borrowed successfully', 'success');
    },
    onError: (error) => {
      closeModal();
      showToast(error.message, 'error');
    },
  });

  const MODALS = {
    deleteBook: {
      id: 'delete-book-modal',
      title: 'Delete Book',
      confirmLabel: 'Delete',
      getMessage: (book) => `Are you sure you want to delete "${book.title}"?`,
      onConfirm: (book) => deleteBook.mutate(book.id),
    },
    borrowBook: {
      id: 'borrow-book-modal',
      title: 'Borrow Book',
      confirmLabel: 'Borrow',
      confirmVariant: 'primary',
      getMessage: (book) => `Are you sure you want to borrow "${book.title}"?`,
      onConfirm: (book) => borrowBook.mutate({ bookId: book.id }),
    },
  };

  const formFields = [
    { id: 'add-book-title-input', label: 'Title', name: 'title', value: title, setter: setTitle, placeholder: 'Book title' },
    { id: 'add-book-price-input', label: 'Price', name: 'price', type: 'number', value: price, setter: setPrice, placeholder: '0.00' },
    { id: 'add-book-fee-input', label: 'Fee', name: 'fee', type: 'number', value: fee, setter: setFee, placeholder: '0.00' },
    { id: 'add-book-copies-input', label: 'Number of Copies', name: 'numberOfCopies', type: 'number', value: numberOfCopies, setter: setNumberOfCopies, placeholder: '1' },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    setValidationError('');
    addBook.reset();

    const trimmedTitle = title.trim();
    if (!trimmedTitle || !authorId || price === '' || fee === '') {
      setValidationError('Please fill all required fields');
      return;
    }

    const numPrice = Number(price);
    const numFee = Number(fee);
    const numCopies = Number(numberOfCopies) || 1;

    if (numPrice < 0) {
      setValidationError('Price cannot be negative');
      return;
    }
    if (numFee < 0) {
      setValidationError('Fee cannot be negative');
      return;
    }
    if (numFee > numPrice) {
      setValidationError('Fee cannot be greater than the price');
      return;
    }
    if (!Number.isInteger(numCopies) || numCopies < 1) {
      setValidationError('Number of copies must be a whole number greater than or equal to 1');
      return;
    }

    addBook.mutate({
      title: trimmedTitle,
      authorId: Number(authorId),
      price: numPrice,
      fee: numFee,
      numberOfCopies: numCopies,
    });
  };

  if (isLoading) return <p>Loading books...</p>;
  if (error) return <p id="books-error">Error: {error.message}</p>;

  return (
    <section id="books-page">
      <PageHeader id="books-page-header" title="Books" subtitle="Browse the library catalog" />

      {isEmployee && (
        <div className={styles.toolbar}>
          <Button
            id="toggle-add-book-btn"
            variant={showForm ? 'outline' : 'primary'}
            onClick={() => { setShowForm(!showForm); setValidationError(''); }}
          >
            {showForm ? 'Cancel' : 'Add Book'}
          </Button>
        </div>
      )}

      {showForm && (
        <form id="add-book-form" className={styles.form} onSubmit={handleSubmit}>
          {formFields.map((field) => (
            <FormInput
              key={field.name}
              id={field.id}
              label={field.label}
              name={field.name}
              type={field.type}
              value={field.value}
              onChange={(e) => field.setter(e.target.value)}
              placeholder={field.placeholder}
            />
          ))}
          <div className={styles.selectGroup}>
            <label htmlFor="add-book-author-select">Author</label>
            <select
              id="add-book-author-select"
              value={authorId}
              onChange={(e) => setAuthorId(e.target.value)}
              className={styles.select}
            >
              <option value="">Select an author</option>
              {authors.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.firstName} {a.surname}
                </option>
              ))}
            </select>
          </div>
          {validationError && <p id="add-book-validation-error" className={styles.error}>{validationError}</p>}
          {addBook.error && <p id="add-book-error" className={styles.error}>{addBook.error.message}</p>}
          <Button id="add-book-submit-btn" type="submit" disabled={addBook.isPending}>
            {addBook.isPending ? 'Adding...' : 'Add Book'}
          </Button>
        </form>
      )}

      <div className={styles.grid}>
        {books.map((book) => (
          <BookCard
            key={book.id}
            book={book}
            canBorrow={true}
            canDelete={isEmployee}
            onBorrow={(id) => setActiveModal({ type: 'borrowBook', item: books.find((b) => b.id === id) })}
            onDelete={(id) => setActiveModal({ type: 'deleteBook', item: books.find((b) => b.id === id) })}
          />
        ))}
      </div>

      {books.length === 0 && <p className={styles.empty}>No books in the catalog yet.</p>}

      {activeModal && (
        <ConfirmModal
          id={MODALS[activeModal.type].id}
          isOpen={true}
          title={MODALS[activeModal.type].title}
          message={MODALS[activeModal.type].getMessage(activeModal.item)}
          confirmLabel={MODALS[activeModal.type].confirmLabel}
          confirmVariant={MODALS[activeModal.type].confirmVariant}
          onConfirm={() => MODALS[activeModal.type].onConfirm(activeModal.item)}
          onCancel={closeModal}
        />
      )}
    </section>
  );
}
