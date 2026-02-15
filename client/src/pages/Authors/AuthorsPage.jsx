import PageHeader from '../../components/PageHeader/PageHeader';
import Placeholder from '../../components/Placeholder/Placeholder';

export default function AuthorsPage() {
  return (
    <section id="authors-page">
      <PageHeader id="authors-page-header" title="Authors" subtitle="Discover authors and their works" />
      <Placeholder id="authors-placeholder" pageName="Authors" description="Author listing will be implemented in a future phase." />
    </section>
  );
}
