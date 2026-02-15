import PageHeader from '../../components/PageHeader/PageHeader';
import Placeholder from '../../components/Placeholder/Placeholder';

export default function ManageCustomersPage() {
  return (
    <section id="manage-customers-page">
      <PageHeader id="manage-customers-page-header" title="Manage Customers" subtitle="View and manage customer accounts" />
      <Placeholder id="manage-customers-placeholder" pageName="Manage Customers" description="Customer management will be implemented in a future phase." />
    </section>
  );
}
