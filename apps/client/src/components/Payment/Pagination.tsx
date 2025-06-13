import React from "react";

interface PaginationProps {
  pageIndex: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  pageIndex,
  pageSize,
  total,
  onPageChange,
  onPageSizeChange,
}) => {
  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="flex justify-between items-center mt-4 text-sm">
      <span>
       Mostrando {Math.min(pageSize, total)} de {total} pagos
      </span>

      <select
        value={pageSize}
        onChange={(e) => {
          onPageSizeChange(Number(e.target.value));
          onPageChange(1); // Reset to first page on size change
        }}
        className="border px-2 py-1 rounded"
      >
        {[5, 10, 20, 50].map((n) => (
          <option key={n} value={n}>
            {n}
          </option>
        ))}
      </select>

      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(Math.max(1, pageIndex - 1))}
          disabled={pageIndex === 1}
          className="border px-3 py-1 rounded disabled:opacity-50"
        >
          Previous
        </button>

        <span>
          Página {pageIndex} de {totalPages || 1}
        </span>

        <button
          onClick={() => onPageChange(Math.min(totalPages, pageIndex + 1))}
          disabled={pageIndex === totalPages || totalPages === 0}
          className="border px-3 py-1 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};
