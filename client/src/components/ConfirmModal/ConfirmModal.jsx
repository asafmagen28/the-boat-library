import Button from '../Button/Button';
import styles from './ConfirmModal.module.scss';

export default function ConfirmModal({
  id,
  isOpen,
  title = 'Confirm',
  message,
  onConfirm,
  onCancel,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  confirmVariant = 'danger',
}) {
  if (!isOpen) return null;

  return (
    <div id={id} className={styles.overlay} onClick={onCancel}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.message}>{message}</p>
        <div className={styles.actions}>
          <Button id={`${id}-cancel-btn`} variant="outline" onClick={onCancel}>
            {cancelLabel}
          </Button>
          <Button id={`${id}-confirm-btn`} variant={confirmVariant} onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
