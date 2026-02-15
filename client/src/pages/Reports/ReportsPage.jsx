import PageHeader from '../../components/PageHeader/PageHeader';
import Placeholder from '../../components/Placeholder/Placeholder';

export default function ReportsPage() {
  return (
    <section id="reports-page">
      <PageHeader id="reports-page-header" title="Reports" subtitle="Library analytics and reports" />
      <Placeholder id="reports-placeholder" pageName="Reports" description="Analytics and reporting will be implemented in a future phase." />
    </section>
  );
}
