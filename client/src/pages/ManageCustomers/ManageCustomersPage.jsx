import { useState } from 'react';
import { useToast } from '../../context/ToastContext';
import { useCustomers, useDeleteUser, useAddBalance } from '../../services/users.api';
import PageHeader from '../../components/PageHeader/PageHeader';
import Button from '../../components/Button/Button';
import ConfirmModal from '../../components/ConfirmModal/ConfirmModal';
import EmptyState from '../../components/EmptyState/EmptyState';
import styles from './ManageCustomersPage.module.scss';

export default function ManageCustomersPage() {
  const { showToast } = useToast();
  const { data: customers = [], isLoading, error } = useCustomers();
  const [customerToDelete, setCustomerToDelete] = useState(null);
  const [customerToLoad, setCustomerToLoad] = useState(null);
  const [depositAmount, setDepositAmount] = useState('');

  const deleteUser = useDeleteUser({
    onSuccess: () => {
      setCustomerToDelete(null);
      showToast('Customer deleted successfully', 'success');
    },
    onError: (error) => {
      setCustomerToDelete(null);
      showToast(error.message, 'error');
    },
  });

  const addBalance = useAddBalance({
    onSuccess: () => {
      setCustomerToLoad(null);
      setDepositAmount('');
      showToast('Funds loaded successfully', 'success');
    },
    onError: (error) => {
      showToast(error.message, 'error');
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

  const handleLoadFundsClick = (customer) => {
    setCustomerToLoad(customer);
    setDepositAmount('');
  };

  const handleConfirmDeposit = () => {
    if (customerToLoad && depositAmount) {
      addBalance.mutate({ userId: customerToLoad.id, amount: parseFloat(depositAmount) });
    }
  };

  const handleCancelDeposit = () => {
    setCustomerToLoad(null);
    setDepositAmount('');
  };

  if (isLoading) return <p>Loading customers...</p>;
  if (error) return <p id="manage-customers-error">Error: {error.message}</p>;

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
                  ₪{Number(customer.budget).toFixed(2)}
                </span>
              </div>
              <span className={styles.date}>Joined: {new Date(customer.createdAt).toLocaleDateString()}</span>
            </div>
            <div className={styles.actions}>
              <Button
                id={`customer-load-funds-btn-${customer.id}`}
                variant="secondary"
                onClick={() => handleLoadFundsClick(customer)}
              >
                Load Funds
              </Button>
              <Button
                id={`customer-delete-btn-${customer.id}`}
                variant="danger"
                onClick={() => handleDeleteClick(customer)}
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
        <div id="load-funds-modal" className={styles.overlay} onClick={handleCancelDeposit}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3 className={styles.modalTitle}>Load Funds</h3>
            <p className={styles.modalMessage}>
              Add funds to <strong>{customerToLoad.username}</strong>'s account.
              Current balance: <strong className={Number(customerToLoad.budget) >= 0 ? styles.budgetPositive : styles.budgetNegative}>₪{Number(customerToLoad.budget).toFixed(2)}</strong>
            </p>
            <input
              id="load-funds-amount-input"
              className={styles.amountInput}
              type="number"
              min="0.01"
              max="10000"
              step="0.01"
              placeholder="Enter amount (₪)"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
            />
            <div className={styles.modalActions}>
              <Button id="load-funds-cancel-btn" variant="outline" onClick={handleCancelDeposit}>
                Cancel
              </Button>
              <Button
                id="load-funds-confirm-btn"
                variant="primary"
                onClick={handleConfirmDeposit}
                disabled={!depositAmount || parseFloat(depositAmount) <= 0}
              >
                Confirm
              </Button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
