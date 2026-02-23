import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { ROLES } from '../../constants/roles';
import { QUERY_KEYS } from '../../services/api';
import { useAuthors, useAddAuthor, useDeleteAuthor } from '../../services/authors.api';
import PageHeader from '../../components/PageHeader/PageHeader';
import Button from '../../components/Button/Button';
import FormInput from '../../components/FormInput/FormInput';
import { NAME_REGEX } from '../../constants/validation';
import ConfirmModal from '../../components/ConfirmModal/ConfirmModal';
import styles from './AuthorsPage.module.scss';

export default function AuthorsPage() {
  const { user } = useAuth();
  const isEmployee = user?.roleId === ROLES.EMPLOYEE;
  const [showForm, setShowForm] = useState(false);

  const [firstName, setFirstName] = useState('');
  const [surname, setSurname] = useState('');
  const [validationError, setValidationError] = useState('');
  const [authorToDelete, setAuthorToDelete] = useState(null);

  const { showToast } = useToast();
  const queryClient = useQueryClient();
  const { data: authors = [], isLoading, error } = useAuthors();

  const addAuthor = useAddAuthor({
    onSuccess: (response) => {
      queryClient.setQueryData(QUERY_KEYS.authors, (old = []) => [
        ...old,
        response.data,
      ]);
      setFirstName('');
      setSurname('');
      setShowForm(false);
    },
  });

  const deleteAuthor = useDeleteAuthor({
    onSuccess: (_response, deletedId) => {
      queryClient.setQueryData(QUERY_KEYS.authors, (old = []) =>
        old.filter((author) => author.id !== deletedId)
      );
      setAuthorToDelete(null);
      showToast('Author deleted successfully', 'success');
    },
    onError: (error) => {
      setAuthorToDelete(null);
      showToast(error.message, 'error');
    },
  });

  const formFields = [
    { id: 'add-author-firstname-input', label: 'First Name', name: 'firstName', value: firstName, setter: setFirstName, placeholder: 'First name' },
    { id: 'add-author-surname-input', label: 'Surname', name: 'surname', value: surname, setter: setSurname, placeholder: 'Surname' },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    setValidationError('');
    addAuthor.reset();

    const trimmedFirst = firstName.trim();
    const trimmedSurname = surname.trim();

    if (!trimmedFirst || !trimmedSurname) {
      setValidationError('Please fill all required fields');
      return;
    }

    if (!NAME_REGEX.test(trimmedFirst) || !NAME_REGEX.test(trimmedSurname)) {
      setValidationError('Names must contain only letters, spaces, hyphens, or apostrophes');
      return;
    }

    addAuthor.mutate({ firstName: trimmedFirst, surname: trimmedSurname });
  };

  if (isLoading) return <p>Loading authors...</p>;
  if (error) return <p id="authors-error">Error: {error.message}</p>;

  return (
    <section id="authors-page">
      <PageHeader id="authors-page-header" title="Authors" subtitle="Discover authors and their works" />

      {isEmployee && (
        <div className={styles.toolbar}>
          <Button
            id="toggle-add-author-btn"
            variant={showForm ? 'outline' : 'primary'}
            onClick={() => { setShowForm(!showForm); setValidationError(''); }}
          >
            {showForm ? 'Cancel' : 'Add Author'}
          </Button>
        </div>
      )}

      {showForm && (
        <form id="add-author-form" className={styles.form} onSubmit={handleSubmit}>
          {formFields.map((field) => (
            <FormInput
              key={field.name}
              id={field.id}
              label={field.label}
              name={field.name}
              value={field.value}
              onChange={(e) => field.setter(e.target.value)}
              placeholder={field.placeholder}
            />
          ))}
          {validationError && <p id="add-author-validation-error" className={styles.error}>{validationError}</p>}
          {addAuthor.error && <p id="add-author-error" className={styles.error}>{addAuthor.error.message}</p>}
          <Button id="add-author-submit-btn" type="submit" disabled={addAuthor.isPending}>
            {addAuthor.isPending ? 'Adding...' : 'Add Author'}
          </Button>
        </form>
      )}

      <div className={styles.list}>
        {authors.map((author) => (
          <div key={author.id} id={`author-item-${author.id}`} className={styles.authorItem}>
            <span className={styles.authorName}>{author.firstName} {author.surname}</span>
            {isEmployee && (
              <Button
                id={`author-delete-btn-${author.id}`}
                variant="danger"
                onClick={() => setAuthorToDelete(author)}
              >
                Delete
              </Button>
            )}
          </div>
        ))}
      </div>

      {authors.length === 0 && <p className={styles.empty}>No authors found.</p>}

      <ConfirmModal
        id="delete-author-modal"
        isOpen={!!authorToDelete}
        title="Delete Author"
        message={`Are you sure you want to delete "${authorToDelete?.firstName} ${authorToDelete?.surname}"?`}
        confirmLabel="Delete"
        onConfirm={() => deleteAuthor.mutate(authorToDelete.id)}
        onCancel={() => setAuthorToDelete(null)}
      />
    </section>
  );
}
