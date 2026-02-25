import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { ROLES } from '../../constants/roles';
import { useAuthors, useAddAuthor, useDeleteAuthor } from '../../services/authors.api';
import PageHeader from '../../components/PageHeader/PageHeader';
import Button from '../../components/Button/Button';
import FormInput from '../../components/FormInput/FormInput';
import { NAME_REGEX } from '../../constants/validation';
import ConfirmModal from '../../components/ConfirmModal/ConfirmModal';
import EmptyState from '../../components/EmptyState/EmptyState';
import styles from './AuthorsPage.module.scss';

export default function AuthorsPage() {
  const { user } = useAuth();
  const isEmployee = user?.roleId === ROLES.EMPLOYEE;
  const [showForm, setShowForm] = useState(false);
  const [authorToDelete, setAuthorToDelete] = useState(null);

  const { register, handleSubmit, reset: resetForm, formState: { errors, isValid } } = useForm({ mode: 'onBlur' });

  const { showToast } = useToast();
  const { data: authors = [], isLoading, error } = useAuthors();

  const addAuthor = useAddAuthor({
    onSuccess: () => {
      resetForm();
      setShowForm(false);
      showToast('Author added successfully', 'success');
    },
  });

  const deleteAuthor = useDeleteAuthor({
    onSuccess: () => {
      setAuthorToDelete(null);
      showToast('Author deleted successfully', 'success');
    },
    onError: (error) => {
      setAuthorToDelete(null);
      // Provide user-friendly error messages
      if (error.message.includes('unsaved author')) {
        showToast('Please wait for the author to save before deleting', 'warning');
      } else {
        showToast(error.message, 'error');
      }
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
          <Button id="add-author-submit-btn" type="submit" disabled={addAuthor.isPending} isFormValid={isValid}>
            {addAuthor.isPending ? 'Adding...' : 'Add Author'}
          </Button>
        </form>
      )}

      <div className={styles.list}>
        {authors.map((author) => (
          <div
            key={author.id}
            id={`author-item-${author.id}`}
            className={`${styles.authorItem} ${author.isOptimistic ? styles.optimistic : ''}`}
          >
            <div className={styles.authorInfo}>
              <span className={styles.authorName}>{author.firstName} {author.surname}</span>
              {author.isOptimistic && (
                <span className={styles.savingIndicator}>Saving...</span>
              )}
            </div>
            {isEmployee && (
              author.isOptimistic ? (
                <Button
                  id={`author-delete-btn-${author.id}`}
                  variant="outline"
                  disabled={true}
                >
                  Saving...
                </Button>
              ) : (
                <Button
                  id={`author-delete-btn-${author.id}`}
                  variant="danger"
                  onClick={() => setAuthorToDelete(author)}
                  disabled={deleteAuthor.isPending}
                >
                  Delete
                </Button>
              )
            )}
          </div>
        ))}
      </div>

      {authors.length === 0 && <EmptyState id="authors-empty-state" message="No authors found." icon="✍️" />}

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
