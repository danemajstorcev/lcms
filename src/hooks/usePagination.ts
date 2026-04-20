import { useState, useMemo } from 'react';

interface UsePaginationResult<T> {
  slice:   T[];
  page:    number;
  setPage: (page: number) => void;
  total:   number;
}

export function usePagination<T>(items: T[], perPage: number = 8): UsePaginationResult<T> {
  const [page, setPage] = useState(1);

  const total = useMemo(
    () => Math.max(1, Math.ceil(items.length / perPage)),
    [items.length, perPage]
  );

  // Reset to page 1 if current page goes out of range
  const safePage = Math.min(page, total);

  const slice = useMemo(
    () => items.slice((safePage - 1) * perPage, safePage * perPage),
    [items, safePage, perPage]
  );

  function handleSetPage(next: number) {
    setPage(Math.max(1, Math.min(next, total)));
  }

  return { slice, page: safePage, setPage: handleSetPage, total };
}
