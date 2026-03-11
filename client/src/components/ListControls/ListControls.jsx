import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import styles from './ListControls.module.scss';

export default function ListControls({
    id = 'list-controls',
    sortOptions = [],
    defaultSortBy = '',
    defaultSortOrder = 'ASC',
    searchPlaceholder = 'Search...'
}) {
    const [searchParams, setSearchParams] = useSearchParams();

    const initialSearch = searchParams.get('search') || '';
    const [searchTerm, setSearchTerm] = useState(initialSearch);

    const sortBy = searchParams.get('sortBy') || defaultSortBy;
    const sortOrder = searchParams.get('sortOrder') || defaultSortOrder;

    // Debounced search
    useEffect(() => {
        const handler = setTimeout(() => {
            if (searchTerm === initialSearch) return;

            const newParams = new URLSearchParams(searchParams);
            if (searchTerm) {
                newParams.set('search', searchTerm);
            } else {
                newParams.delete('search');
            }
            // Reset to page 1 on new search
            newParams.delete('page');
            setSearchParams(newParams);
        }, 500);

        return () => clearTimeout(handler);
    }, [searchTerm, searchParams, setSearchParams, initialSearch]);

    const handleSortChange = (e) => {
        const value = e.target.value;
        const newParams = new URLSearchParams(searchParams);

        if (value) {
            newParams.set('sortBy', value);
        } else {
            newParams.delete('sortBy');
        }

        // Default to ASC when changing sort field
        newParams.set('sortOrder', 'ASC');
        setSearchParams(newParams);
    };

    const toggleSortOrder = () => {
        const newParams = new URLSearchParams(searchParams);
        newParams.set('sortOrder', sortOrder === 'ASC' ? 'DESC' : 'ASC');
        setSearchParams(newParams);
    };

    return (
        <div id={id} className={styles.container}>
            <div className={styles.searchBox}>
                <span className={styles.searchIcon}>🔍</span>
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder={searchPlaceholder}
                    className={styles.searchInput}
                />
                {searchTerm && (
                    <button
                        className={styles.clearBtn}
                        onClick={() => setSearchTerm('')}
                        aria-label="Clear search"
                    >
                        ✕
                    </button>
                )}
            </div>

            {sortOptions.length > 0 && (
                <div className={styles.sortBox}>
                    <select
                        className={styles.sortSelect}
                        value={sortBy}
                        onChange={handleSortChange}
                        aria-label="Sort by"
                    >
                        {sortOptions.map(option => (
                            <option key={option.value} value={option.value}>
                                Sort by: {option.label}
                            </option>
                        ))}
                    </select>
                    <button
                        className={styles.sortOrderBtn}
                        onClick={toggleSortOrder}
                        aria-label="Toggle sort order"
                        title={`Current: ${sortOrder === 'ASC' ? 'Ascending' : 'Descending'}`}
                    >
                        {sortOrder === 'ASC' ? '↑' : '↓'}
                    </button>
                </div>
            )}
        </div>
    );
}
