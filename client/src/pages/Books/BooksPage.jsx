import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../context/AuthContext';
import { ROLES } from '../../constants/roles';
import { useBooks, useAddBook, useDeleteBook, useBorrowBook, useAuthors, QUERY_KEYS } from '../../services/api';
import PageHeader from '../../components/PageHeader/PageHeader';
import BookCard from '../../components/BookCard/BookCard';
import Button from '../../components/Button/Button';
import FormInput from '../../components/FormInput/FormInput';
import styles from './BooksPage.module.scss';

export default function BooksPage() {
  const { user } = useAuth();
  const isEmployee = user?.roleId === ROLES.EMPLOYEE;
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [authorId, setAuthorId] = useState('');
  const [price, setPrice] = useState('');
  const [fee, setFee] = useState('');
  const [numberOfCopies, setNumberOfCopies] = useState('1');

  const { data: books = [], isLoading, error } = useBooks();
  const { data: authors = [] } = useAuthors({ enabled: showForm });

  const addBook = useAddBook({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.books });
      setTitle('');
      setAuthorId('');
      setPrice('');
      setFee('');
      setNumberOfCopies('1');
      setShowForm(false);
    },
  });

  const deleteBook = useDeleteBook({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.books });
    },
  });

  const borrowBook = useBorrowBook({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.books });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.myLoans });
    },
  });

  const formFields = [
    { id: 'add-book-title-input', label: 'Title', name: 'title', value: title, setter: setTitle, placeholder: 'Book title' },
    { id: 'add-book-price-input', label: 'Price', name: 'price', type: 'number', value: price, setter: setPrice, placeholder: '0.00' },
    { id: 'add-book-fee-input', label: 'Fee', name: 'fee', type: 'number', value: fee, setter: setFee, placeholder: '0.00' },
    { id: 'add-book-copies-input', label: 'Number of Copies', name: 'numberOfCopies', type: 'number', value: numberOfCopies, setter: setNumberOfCopies, placeholder: '1' },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !authorId || !price || !fee) return;
    addBook.mutate({
      title,
      authorId: Number(authorId),
      price: Number(price),
      fee: Number(fee),
      numberOfCopies: Number(numberOfCopies) || 1,
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
            onClick={() => setShowForm(!showForm)}
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
          {addBook.error && <p id="add-book-error" className={styles.error}>{addBook.error.message}</p>}
          <Button id="add-book-submit-btn" type="submit" disabled={addBook.isPending}>
            {addBook.isPending ? 'Adding...' : 'Add Book'}
          </Button>
        </form>
      )}

      {deleteBook.error && <p id="delete-book-error" className={styles.error}>{deleteBook.error.message}</p>}
      {borrowBook.error && <p id="borrow-book-error" className={styles.error}>{borrowBook.error.message}</p>}

      <div className={styles.grid}>
        {books.map((book) => (
          <BookCard
            key={book.id}
            book={book}
            canBorrow={true}
            canDelete={isEmployee}
            onBorrow={(id) => borrowBook.mutate({ bookId: id })}
            onDelete={(id) => deleteBook.mutate(id)}
          />
        ))}
      </div>

      {books.length === 0 && <p className={styles.empty}>No books in the catalog yet.</p>}
    </section>
  );
}
