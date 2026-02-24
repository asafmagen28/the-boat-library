import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { ROLES } from '../../constants/roles';
import { useBooks, useAddBook, useDeleteBook } from '../../services/books.api';
import { useBorrowBook } from '../../services/loans.api';
import { useAuthors } from '../../services/authors.api';
import PageHeader from '../../components/PageHeader/PageHeader';
import BookCard from '../../components/BookCard/BookCard';
import Button from '../../components/Button/Button';
import FormInput from '../../components/FormInput/FormInput';
import ConfirmModal from '../../components/ConfirmModal/ConfirmModal';
import Pagination from '../../components/Pagination/Pagination';
import EmptyState from '../../components/EmptyState/EmptyState';
import styles from './BooksPage.module.scss';

export default function BooksPage() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const isEmployee = user?.roleId === ROLES.EMPLOYEE;
  const [showForm, setShowForm] = useState(false);
  const [activeModal, setActiveModal] = useState(null);
  const closeModal = () => setActiveModal(null);

  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get('page')) || 1;

  const { register, handleSubmit, watch, reset: resetForm, formState: { errors } } = useForm({
    mode: 'onBlur',
    defaultValues: { numberOfCopies: '1' },
  });

  const { data, isLoading, error, isPlaceholderData } = useBooks({ page });
  const books = data?.books ?? [];
  const totalPages = data?.totalPages ?? 0;
  const currentPage = data?.currentPage ?? page;
  const { data: authors = [] } = useAuthors({ enabled: showForm });

  const addBook = useAddBook({
    onSuccess: (response) => {
      resetForm();
      setShowForm(false);
      const newBook = response?.data;
      if (newBook?.title) {
        showToast(`"${newBook.title}" has been added to your library!`, 'success');
      } else {
        showToast('Book added successfully', 'success');
      }
    },
  });

  const deleteBook = useDeleteBook({
    onSuccess: () => {
      closeModal();
      showToast('Book deleted successfully', 'success');
    },
    onError: (error) => {
      closeModal();
      showToast(error.message, 'error');
    },
  });

  const borrowBook = useBorrowBook({
    onSuccess: () => {
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

  const validationRules = {
    title: {
      required: 'Title is required',
      validate: { notEmpty: (v) => v.trim() !== '' || 'Title cannot be empty' },
    },
    price: {
      required: 'Price is required',
      min: { value: 0, message: 'Price cannot be negative' },
    },
    fee: {
      required: 'Fee is required',
      min: { value: 0, message: 'Fee cannot be negative' },
      validate: {
        notGreaterThanPrice: (v) => Number(v) <= Number(watch('price')) || 'Fee cannot be greater than the price',
      },
    },
    numberOfCopies: {
      required: 'Number of copies is required',
      min: { value: 1, message: 'Must be at least 1' },
      validate: {
        integer: (v) => Number.isInteger(Number(v)) || 'Must be a whole number',
      },
    },
    authorId: {
      required: 'Please select an author',
    },
  };

  const formFields = [
    { id: 'add-book-title-input', label: 'Title', name: 'title', placeholder: 'Book title' },
    { id: 'add-book-price-input', label: 'Price', name: 'price', type: 'number', placeholder: '0.00' },
    { id: 'add-book-fee-input', label: 'Fee', name: 'fee', type: 'number', placeholder: '0.00' },
    { id: 'add-book-copies-input', label: 'Number of Copies', name: 'numberOfCopies', type: 'number', placeholder: '1' },
  ];

  const onSubmit = (data) => {
    addBook.reset();
    addBook.mutate({
      title: data.title.trim(),
      authorId: Number(data.authorId),
      price: Number(data.price),
      fee: Number(data.fee),
      numberOfCopies: Number(data.numberOfCopies),
    });
  };

  const handlePageChange = (newPage) => {
    setSearchParams(newPage === 1 ? {} : { page: String(newPage) });
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
            onClick={() => { setShowForm(!showForm); resetForm(); }}
          >
            {showForm ? 'Cancel' : 'Add Book'}
          </Button>
        </div>
      )}

      {showForm && (
        <form id="add-book-form" className={styles.form} onSubmit={handleSubmit(onSubmit)}>
          {formFields.map((field) => (
            <FormInput
              key={field.name}
              id={field.id}
              label={field.label}
              type={field.type}
              placeholder={field.placeholder}
              error={errors[field.name]?.message}
              {...register(field.name, validationRules[field.name])}
            />
          ))}
          <div className={styles.selectGroup}>
            <label htmlFor="add-book-author-select">Author</label>
            <select
              id="add-book-author-select"
              className={styles.select}
              {...register('authorId', validationRules.authorId)}
            >
              <option value="">Select an author</option>
              {authors.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.firstName} {a.surname}
                </option>
              ))}
            </select>
            {errors.authorId && <span className={styles.error}>{errors.authorId.message}</span>}
          </div>
          {addBook.error && <p id="add-book-error" className={styles.error}>{addBook.error.message}</p>}
          <Button id="add-book-submit-btn" type="submit" disabled={addBook.isPending}>
            {addBook.isPending ? 'Adding...' : 'Add Book'}
          </Button>
        </form>
      )}

      <div className={`${styles.grid} ${isPlaceholderData ? styles.loading : ''}`}>
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

      {books.length === 0 && <EmptyState id="books-empty-state" message="No books in the catalog yet." icon="📚" />}

      <Pagination
        id="books-pagination"
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        isDisabled={isPlaceholderData}
      />

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
