import type { ReactNode } from "react";

type ModalProps = { open: boolean; title: string; onClose: () => void; children: ReactNode };

export function Modal({ open, title, onClose, children }: ModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-content/40 p-4" role="presentation" onMouseDown={onClose}>
      <section className="w-full max-w-lg rounded-card border border-border bg-surface p-6 shadow-card" role="dialog" aria-modal="true" aria-labelledby="modal-title" onMouseDown={(event) => event.stopPropagation()}>
        <div className="mb-4 flex items-start justify-between gap-4">
          <h2 id="modal-title" className="text-lg font-bold text-content">{title}</h2>
          <button type="button" className="text-content-muted hover:text-content" onClick={onClose} aria-label="Close dialog">×</button>
        </div>
        {children}
      </section>
    </div>
  );
}
