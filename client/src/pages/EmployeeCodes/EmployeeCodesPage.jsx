import { useState } from 'react';
import { employeeCodeAPI } from '../../services/api';
import PageHeader from '../../components/PageHeader/PageHeader';
import Button from '../../components/Button/Button';
import styles from './EmployeeCodesPage.module.scss';

export default function EmployeeCodesPage() {
  const [generatedCode, setGeneratedCode] = useState('');
  const [expiresAt, setExpiresAt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    setError('');
    setGeneratedCode('');
    setExpiresAt('');
    setIsLoading(true);
    try {
      const { data } = await employeeCodeAPI.generateCode();
      setGeneratedCode(data.code);
      setExpiresAt(data.expiresAt);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

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
          onClick={handleGenerate}
          disabled={isLoading}
        >
          {isLoading ? 'Generating...' : 'Generate Code'}
        </Button>

        {error && (
          <p id="generate-code-error" className={styles.error} role="alert">{error}</p>
        )}

        {generatedCode && (
          <div id="generated-code-display" className={styles.codeCard} role="status" aria-live="polite">
            <p className={styles.warning}>This code will only be shown once. Copy it now.</p>
            <div className={styles.codeBox}>
              <code id="generated-code-value" className={styles.codeValue}>
                {generatedCode}
              </code>
            </div>
            <Button
              id="copy-code-btn"
              variant="secondary"
              onClick={() => navigator.clipboard.writeText(generatedCode)}
            >
              Copy Code
            </Button>
            <p id="generated-code-expiry" className={styles.expiry}>
              Expires: {new Date(expiresAt).toLocaleDateString()}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
