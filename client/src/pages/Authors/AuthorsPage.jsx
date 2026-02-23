import { useState } from 'react';
import { useForm } from 'react-hook-form';
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
  const [authorToDelete, setAuthorToDelete] = useState(null);

  const { register, handleSubmit, reset: resetForm, formState: { errors } } = useForm({ mode: 'onBlur' });

  const { showToast } = useToast();
  const queryClient = useQueryClient();
  const { data: authors = [], isLoading, error } = useAuthors();

  const addAuthor = useAddAuthor({
    onSuccess: (response) => {
      queryClient.setQueryData(QUERY_KEYS.authors, (old = []) => [
        ...old,
        response.data,
      ]);
      resetForm();
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
    { id: 'add-author-firstname-input', label: 'First Name', name: 'firstName', placeholder: 'First name' },
    { id: 'add-author-surname-input', label: 'Surname', name: 'surname', placeholder: 'Surname' },
  ];

  const nameRules = {
    required: 'This field is required',
    validate: {
      notEmpty: (v) => v.trim() !== '' || 'This field cannot be empty',
      pattern: (v) => NAME_REGEX.test(v.trim()) || 'Names must contain only letters, spaces, hyphens, or apostrophes',
    },
  };

  const onSubmit = (data) => {
    addAuthor.reset();
    addAuthor.mutate({ firstName: data.firstName.trim(), surname: data.surname.trim() });
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
            onClick={() => { setShowForm(!showForm); resetForm(); }}
          >
            {showForm ? 'Cancel' : 'Add Author'}
          </Button>
        </div>
      )}

      {showForm && (
        <form id="add-author-form" className={styles.form} onSubmit={handleSubmit(onSubmit)}>
          {formFields.map((field) => (
            <FormInput
              key={field.name}
              id={field.id}
              label={field.label}
              placeholder={field.placeholder}
              error={errors[field.name]?.message}
              {...register(field.name, nameRules)}
            />
          ))}
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
