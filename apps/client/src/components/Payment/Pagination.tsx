import React from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

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
    <div className="sm:block lg:flex justify-between font-urbanist gap-2 items-center mt-4 text-sm">
      <span className="m-3 text-gray-500">
       {/* Mostrando {Math.min(pageSize, total)} de {total} pagos */}
       Mostrando


      <select
        value={pageSize}
        onChange={(e) => {
          onPageSizeChange(Number(e.target.value));
          onPageChange(1); // Reset to first page on size change
        }}
        className="border border-gray-500 m-1 px-2 py-1 rounded"
      >
        {[5, 10, 20, 50].map((n) => (
          <option key={n} value={n}>
            {n}
          </option>
        ))}
      </select>

      pagos
       </span>

      <div className="flex items-center m-3 gap-2">
        <button
          onClick={() => onPageChange(Math.max(1, pageIndex - 1))}
          disabled={pageIndex === 1}
          className="hover:bg-gray-400 px-3 py-1 rounded disabled:opacity-50"
        >
          <ArrowLeft size={15}/>
        </button>

        <span>
          Página {pageIndex} de {totalPages || 1}
        </span>

        <button
          onClick={() => onPageChange(Math.min(totalPages, pageIndex + 1))}
          disabled={pageIndex === totalPages || totalPages === 0}
          className="hover:bg-gray-400 px-3 py-1 rounded disabled:opacity-50"
        >
          <ArrowRight size={15}/>
        </button>
      </div>
    </div>
  );
};
