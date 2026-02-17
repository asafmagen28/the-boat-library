import PageHeader from '../../components/PageHeader/PageHeader';
import Button from '../../components/Button/Button';
import styles from './EmployeeCodesPage.module.scss';
import { useGenerateCode } from '../../services/api';

export default function EmployeeCodesPage() {
  const { mutate, data, isPending, error } = useGenerateCode();

  return (
    <section id="employee-codes-page">
      <PageHeader
        id="employee-codes-page-header"
        title="Employee Codes"
        subtitle="Generate one-time invitation codes for new employees"
      />

      <div className={styles.content}>
        <Button
          id="generate-code-btn"
          onClick={mutate}
          disabled={isPending}
        >
          {isPending ? 'Generating...' : 'Generate Code'}
        </Button>

        {error && (
          <p id="generate-code-error" className={styles.error} role="alert">{error.message}</p>
        )}

        {data && (
          <div id="generated-code-display" className={styles.codeCard} role="status" aria-live="polite">
            <p className={styles.warning}>This code will only be shown once. Copy it now.</p>
            <div className={styles.codeBox}>
              <code id="generated-code-value" className={styles.codeValue}>
                {data.data.code}
              </code>
            </div>
            <Button
              id="copy-code-btn"
              variant="secondary"
              onClick={() => navigator.clipboard.writeText(data.data.code)}
            >
              Copy Code
            </Button>
            <p id="generated-code-expiry" className={styles.expiry}>
              Expires: {new Date(data.data.expiresAt).toLocaleDateString()}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
