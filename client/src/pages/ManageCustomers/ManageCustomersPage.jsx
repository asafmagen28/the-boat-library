import { useState } from 'react';
import { useToast } from '../../context/ToastContext';
import { useCustomers, useDeleteUser, useAddBalance } from '../../services/users.api';
import PageHeader from '../../components/PageHeader/PageHeader';
import Button from '../../components/Button/Button';
import ConfirmModal from '../../components/ConfirmModal/ConfirmModal';
import EmptyState from '../../components/EmptyState/EmptyState';
import LoadFundsModal from './LoadFundsModal';
import { formatBalance, formatDate } from '../../utils/formatters';
import { getUserFriendlyErrorMessage } from '../../utils/errorMessages';
import styles from './ManageCustomersPage.module.scss';

export default function ManageCustomersPage() {
  const { showToast } = useToast();
  const { data: customers = [], isLoading, error } = useCustomers();
  const [customerToDelete, setCustomerToDelete] = useState(null);
  const [customerToLoad, setCustomerToLoad] = useState(null);

  const deleteUser = useDeleteUser({
    onSuccess: () => {
      setCustomerToDelete(null);
      showToast('Customer deleted successfully', 'success');
    },
    onError: (error) => {
      setCustomerToDelete(null);
      showToast(getUserFriendlyErrorMessage(error, 'Failed to delete customer. Please try again.'), 'error');
    },
  });

  const addBalance = useAddBalance({
    onSuccess: () => {
      setCustomerToLoad(null);
      showToast('Funds loaded successfully', 'success');
    },
    onError: (error) => {
      showToast(getUserFriendlyErrorMessage(error, 'Failed to load funds. Please try again.'), 'error');
    },
  });

  const handleConfirmDelete = () => {
    if (customerToDelete) {
      deleteUser.mutate(customerToDelete.id);
    }
  };

  const handleConfirmDeposit = (amount) => {
    addBalance.mutate({ userId: customerToLoad.id, amount });
  };

  if (isLoading) return <p>Loading customers...</p>;
  if (error) return <p id="manage-customers-error">Error: {getUserFriendlyErrorMessage(error, 'Failed to load customers. Please try again.')}</p>;

  return (
    <section id="manage-customers-page">
      <PageHeader id="manage-customers-page-header" title="Manage Customers" subtitle="View and manage customer accounts" />

      <div className={styles.list}>
        {customers.map((customer) => (
          <div key={customer.id} id={`customer-item-${customer.id}`} className={styles.customerItem}>
            <div className={styles.customerInfo}>
              <div className={styles.nameRow}>
                <span className={styles.username}>{customer.username}</span>
                <span className={`${styles.budget} ${Number(customer.budget) >= 0 ? styles.budgetPositive : styles.budgetNegative}`}>
                  {formatBalance(customer.budget)}
                </span>
              </div>
              <span className={styles.date}>Joined: {formatDate(customer.createdAt)}</span>
            </div>
            <div className={styles.actions}>
              <Button
                id={`customer-load-funds-btn-${customer.id}`}
                variant="secondary"
                onClick={() => setCustomerToLoad(customer)}
              >
                Load Funds
              </Button>
              <Button
                id={`customer-delete-btn-${customer.id}`}
                variant="danger"
                onClick={() => setCustomerToDelete(customer)}
              >
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>

      {customers.length === 0 && <EmptyState id="manage-customers-empty-state" message="No customers found." icon="👤" />}

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

      {customerToLoad && (
        <LoadFundsModal
          customer={customerToLoad}
          onConfirm={handleConfirmDeposit}
          onCancel={() => setCustomerToLoad(null)}
          isLoading={addBalance.isPending}
        />
      )}
    </section>
  );
}
