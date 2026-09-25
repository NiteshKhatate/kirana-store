import type { ReactNode } from "react";

export type TableColumn<T> = { key: string; header: string; render: (row: T) => ReactNode };

export function Table<T>({ columns, rows, getRowKey }: { columns: TableColumn<T>[]; rows: T[]; getRowKey: (row: T) => string }) {
  return (
    <div className="overflow-x-auto rounded-control border border-border">
      <table className="min-w-full divide-y divide-border text-left text-sm">
        <thead className="bg-surface-muted text-xs uppercase tracking-wide text-content-muted">
          <tr>{columns.map((column) => <th key={column.key} className="whitespace-nowrap px-4 py-3 font-semibold">{column.header}</th>)}</tr>
        </thead>
        <tbody className="divide-y divide-border bg-surface">
          {rows.map((row) => <tr key={getRowKey(row)} className="hover:bg-surface-muted">{columns.map((column) => <td key={column.key} className="whitespace-nowrap px-4 py-3 text-content">{column.render(row)}</td>)}</tr>)}
        </tbody>
      </table>
    </div>
  );
}
