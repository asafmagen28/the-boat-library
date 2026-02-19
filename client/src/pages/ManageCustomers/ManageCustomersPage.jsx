import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '../../services/api';
import { useCustomers, useDeleteUser } from '../../services/users.api';
import PageHeader from '../../components/PageHeader/PageHeader';
import Button from '../../components/Button/Button';
import ConfirmModal from '../../components/ConfirmModal/ConfirmModal';
import styles from './ManageCustomersPage.module.scss';

export default function ManageCustomersPage() {
  const queryClient = useQueryClient();
  const { data: customers = [], isLoading, error } = useCustomers();
  const [customerToDelete, setCustomerToDelete] = useState(null);

  const deleteUser = useDeleteUser({
    onSuccess: (_response, deletedId) => {
      queryClient.setQueryData(QUERY_KEYS.customers, (old = []) =>
        old.filter((customer) => customer.id !== deletedId)
      );
      setCustomerToDelete(null);
    },
  });

  const handleDeleteClick = (customer) => {
    setCustomerToDelete(customer);
  };

  const handleConfirmDelete = () => {
    if (customerToDelete) {
      deleteUser.mutate(customerToDelete.id);
    }
  };

  if (isLoading) return <p>Loading customers...</p>;
  if (error) return <p id="manage-customers-error">Error: {error.message}</p>;

  return (
    <section id="manage-customers-page">
      <PageHeader id="manage-customers-page-header" title="Manage Customers" subtitle="View and manage customer accounts" />

      {deleteUser.error && <p id="delete-customer-error" className={styles.error}>{deleteUser.error.message}</p>}

      <div className={styles.list}>
        {customers.map((customer) => (
          <div key={customer.id} id={`customer-item-${customer.id}`} className={styles.customerItem}>
            <div className={styles.customerInfo}>
              <span className={styles.username}>{customer.username}</span>
              <span className={styles.date}>Joined: {new Date(customer.createdAt).toLocaleDateString()}</span>
            </div>
            <Button
              id={`customer-delete-btn-${customer.id}`}
              variant="danger"
              onClick={() => handleDeleteClick(customer)}
            >
              Delete
            </Button>
          </div>
        ))}
      </div>

      {customers.length === 0 && <p className={styles.empty}>No customers found.</p>}

      <ConfirmModal
        id="delete-customer-modal"
        isOpen={!!customerToDelete}
        title="Delete Customer"
        message={`Are you sure you want to delete "${customerToDelete?.username}"? This action cannot be undone.`}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        onConfirm={handleConfirmDelete}
        onCancel={() => setCustomerToDelete(null)}
      />
    </section>
  );
}
