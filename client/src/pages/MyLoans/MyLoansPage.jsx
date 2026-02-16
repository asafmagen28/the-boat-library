import PageHeader from '../../components/PageHeader/PageHeader';
import Placeholder from '../../components/Placeholder/Placeholder';

export default function MyLoansPage() {
  return (
    <section id="my-loans-page">
      <PageHeader id="my-loans-page-header" title="My Loans" subtitle="View and manage your active loans" />
      <Placeholder id="my-loans-placeholder" pageName="My Loans" description="Loan history and active loans will be implemented in a future phase." />
    </section>
  );
}
