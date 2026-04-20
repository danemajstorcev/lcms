import Button from "./Button";

interface PaginationProps {
  page: number;
  total: number;
  setPage: (page: number) => void;
}

export default function Pagination({ page, total, setPage }: PaginationProps) {
  if (total <= 1) return null;

  return (
    <div className="pagination">
      <Button
        sm
        variant="ghost"
        onClick={() => setPage(page - 1)}
        disabled={page === 1}
      >
        ‹
      </Button>

      {Array.from({ length: total }, (_, i) => i + 1).map((n) => (
        <button
          key={n}
          onClick={() => setPage(n)}
          className={`pagination__page-btn${n === page ? " pagination__page-btn--active" : ""}`}
        >
          {n}
        </button>
      ))}

      <Button
        sm
        variant="ghost"
        onClick={() => setPage(page + 1)}
        disabled={page === total}
      >
        ›
      </Button>
    </div>
  );
}
