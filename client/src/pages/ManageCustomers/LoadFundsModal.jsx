import { useState } from 'react';
import Button from '../../components/Button/Button';
import { formatBalance } from '../../utils/formatters';
import styles from './LoadFundsModal.module.scss';

export default function LoadFundsModal({ customer, onConfirm, onCancel }) {
  const [depositAmount, setDepositAmount] = useState('');

  const handleConfirm = () => {
    if (depositAmount && parseFloat(depositAmount) > 0) {
      onConfirm(parseFloat(depositAmount));
    }
  };

  return (
    <div id="load-funds-modal" className={styles.overlay} onClick={onCancel}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h3 className={styles.modalTitle}>Load Funds</h3>
        <p className={styles.modalMessage}>
          Add funds to <strong>{customer.username}</strong>'s account.
          Current balance:{' '}
          <strong className={Number(customer.budget) >= 0 ? styles.budgetPositive : styles.budgetNegative}>
            {formatBalance(customer.budget)}
          </strong>
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
          <Button id="load-funds-cancel-btn" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            id="load-funds-confirm-btn"
            variant="primary"
            onClick={handleConfirm}
            disabled={!depositAmount || parseFloat(depositAmount) <= 0}
          >
            Confirm
          </Button>
        </div>
      </div>
    </div>
  );
}
