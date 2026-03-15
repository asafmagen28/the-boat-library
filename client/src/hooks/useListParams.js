import { useSearchParams } from 'react-router-dom';

export default function useListParams(defaultSortBy = '', defaultSortOrder = 'ASC') {
    const [searchParams, setSearchParams] = useSearchParams();

    const page = Number(searchParams.get('page')) || 1;
    const search = searchParams.get('search') || '';
    const sortBy = searchParams.get('sortBy') || defaultSortBy;
    const sortOrder = searchParams.get('sortOrder') || defaultSortOrder;

    const handlePageChange = (newPage) => {
        const newParams = new URLSearchParams(searchParams);
        if (newPage === 1) {
            newParams.delete('page');
        } else {
            newParams.set('page', String(newPage));
        }
        setSearchParams(newParams);
    };

    return {
        page,
        search,
        sortBy,
        sortOrder,
        searchParams,
        setSearchParams,
        handlePageChange
    };
}
