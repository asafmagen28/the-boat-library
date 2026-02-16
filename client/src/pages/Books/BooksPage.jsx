import PageHeader from '../../components/PageHeader/PageHeader';
import Placeholder from '../../components/Placeholder/Placeholder';
import BookCard from 'components/BookCard/BookCard';

export default function BooksPage() {
  return (
    <section id="books-page">
      <PageHeader id="books-page-header" title="Books" subtitle="Browse the library catalog" />
      <Placeholder id="books-placeholder" pageName="Books" description="Book listing and search will be implemented in a future phase." />

      <BookCard book={{title: 'gerhso the GOAT', publicationYear: 2020, availableCopies: 25}}/>
    </section>
  );
}
