import { HTMLAttributes } from "react";

export const Table = ({ className, ...props }: HTMLAttributes<HTMLTableElement>) => (
  <table className={`min-w-full divide-y divide-gray-200 ${className}`} {...props} />
);

export const TableHeader = ({ className, ...props }: HTMLAttributes<HTMLElement>) => (
  <thead className={`${className}`} {...props} />
);

export const TableBody = ({ className, ...props }: HTMLAttributes<HTMLElement>) => (
  <tbody className={`${className}`} {...props} />
);

export const TableHead = ({ className, ...props }: HTMLAttributes<HTMLTableCellElement>) => (
  <th className={`px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider ${className}`} {...props} />
);

export const TableRow = ({ className, ...props }: HTMLAttributes<HTMLTableRowElement>) => (
  <tr className={`${className}`} {...props} />
);

export const TableCell = ({ className, ...props }: HTMLAttributes<HTMLTableCellElement>) => (
  <td className={`px-6 py-4 whitespace-nowrap ${className}`} {...props} />
);
