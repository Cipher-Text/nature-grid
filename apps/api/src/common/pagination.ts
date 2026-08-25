/** Clamp page/pageSize to safe ranges to prevent negative skips or runaway queries. */
export function clampPagination(
  page: number,
  pageSize: number,
  maxPageSize = 100,
): { page: number; pageSize: number } {
  return {
    page: Math.max(1, isFinite(page) ? Math.floor(page) : 1),
    pageSize: Math.min(Math.max(1, isFinite(pageSize) ? Math.floor(pageSize) : 20), maxPageSize),
  };
}
