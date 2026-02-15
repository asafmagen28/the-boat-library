import PageHeader from '../../components/PageHeader/PageHeader';
import Placeholder from '../../components/Placeholder/Placeholder';

export default function BudgetPage() {
  return (
    <section id="budget-page">
      <PageHeader id="budget-page-header" title="Budget" subtitle="Check your balance and transactions" />
      <Placeholder id="budget-placeholder" pageName="Budget" description="Budget overview and transaction history will be implemented in a future phase." />
    </section>
  );
}
