import Link from 'next/link';

interface ListPaginationProps {
  pathname: string;
  page: number;
  pageSize: number;
  total: number;
  query?: Record<string, string | undefined>;
  pageParam?: string;
}

function href(pathname: string, page: number, query: Record<string, string | undefined>, pageParam: string) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries({ ...query, [pageParam]: String(page) })) {
    if (value && value !== '1') params.set(key, value);
  }
  const qs = params.toString();
  return `${pathname}${qs ? `?${qs}` : ''}`;
}

export default function ListPagination({ pathname, page, pageSize, total, query = {}, pageParam = 'page' }: ListPaginationProps) {
  const totalPages = Math.ceil(total / pageSize);
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1)
    .filter((value) => value === 1 || value === totalPages || Math.abs(value - page) <= 1);
  const visible: Array<number | 'ellipsis'> = [];
  for (const value of pages) {
    if (visible.length && typeof visible[visible.length - 1] === 'number' && value - Number(visible[visible.length - 1]) > 1) {
      visible.push('ellipsis');
    }
    visible.push(value);
  }

  return (
    <nav className="list-pagination" aria-label="Pagination">
      {page > 1 ? <Link className="pagination-button" href={href(pathname, page - 1, query, pageParam)}>Previous</Link> : <span className="pagination-button disabled" aria-disabled="true">Previous</span>}
      <span className="pagination-pages">
        {visible.map((value, index) => value === 'ellipsis'
          ? <span key={`ellipsis-${index}`} className="pagination-ellipsis" aria-hidden="true">…</span>
          : value === page
            ? <span key={value} className="pagination-button active" aria-current="page">{value}</span>
            : <Link key={value} className="pagination-button" href={href(pathname, value, query, pageParam)} aria-label={`Go to page ${value}`}>{value}</Link>)}
      </span>
      {page < totalPages ? <Link className="pagination-button" href={href(pathname, page + 1, query, pageParam)}>Next</Link> : <span className="pagination-button disabled" aria-disabled="true">Next</span>}
    </nav>
  );
}
