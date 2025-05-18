// src/components/UI/TableLayout.tsx
import React from "react";

interface TableColumn<T> {
  key: keyof T | string;
  label: string;
  className?: string;
  render?: (item: T, index: number) => React.ReactNode; // <- ajustar aquí
}
interface TableLayoutProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  title?: string;
  emptyMessage?: string;
  className?: string;
}

export function TableLayout<T>({
  data,
  columns,
  title,
  emptyMessage = "No hay registros para mostrar.",
  className = "",
}: TableLayoutProps<T>) {
  return (
    <div className={`overflow-x-auto w-full ${className}`}>
      {title && <h3 className="text-2xl font-playfair text-gray-charcoal font-bold mb-4">{title}</h3>}

      <table className="min-w-full font-urbanist table-auto bg-white shadow-2xl rounded-xl">
        <thead>
          <tr className="text-left lg:text-lg sm:text-base text-gray-500">
            {columns.map((col, idx) => (
              <th key={idx} className={`px-4 py-2 font-semibold ${col.className ?? ""}`}>{col.label}</th>
            ))}
          </tr>
        </thead>
        <tbody className="text-sm">
          {data.length > 0 ? (
            data.map((item, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-gray-50 border-t border-eggshell-200">
                {columns.map((col, colIndex) => (
                  <td key={colIndex} className={`px-4 py-3 ${col.className ?? ""}`}>
                    {col.render ? col.render(item, rowIndex) : (item as any)[col.key]}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} className="py-8 px-4 text-center text-gray-400">
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
