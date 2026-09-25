import { useState } from "react";
import Head from "next/head";

import { AppShell } from "@/components/layout/AppShell";
import { CategoryForm } from "@/components/forms/CategoryForm";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { Modal } from "@/components/ui/Modal";
import { Table } from "@/components/ui/Table";
import { LoadingState } from "@/components/ui/LoadingState";
import { useCategories, type Category } from "@/features/catalog/use-categories";
import type { CategoryInput } from "@/schemas/catalog";

export default function CategoriesPage() {
  const categories = useCategories();
  const [editing, setEditing] = useState<Category | undefined>();
  const [open, setOpen] = useState(false);
  const [success, setSuccess] = useState(false);
  const save = async (input: CategoryInput) => { await categories.saveCategory({ id: editing?.id, input }); setEditing(undefined); setOpen(false); setSuccess(true); };

  return <><Head><title>Categories | Kirana Store Manager</title></Head><AppShell title="Categories"><div className="space-y-6"><div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end"><div><p className="text-sm font-semibold text-brand-600">Catalog</p><h2 className="mt-1 text-2xl font-bold text-content">Categories</h2><p className="mt-1 text-sm text-content-muted">Organize products for faster daily operations.</p></div><Button onClick={() => { setEditing(undefined); setOpen(true); }}>Add category</Button></div>{success && <Alert tone="success">Category saved successfully.</Alert>}{categories.isPending && <LoadingState label="Loading categories…" />}{categories.isError && <ErrorState message={categories.error.message} onRetry={() => void categories.refetch()} />}{categories.data && categories.data.length === 0 && <EmptyState title="No categories yet" description="Create your first category to organize products." />}{categories.data && categories.data.length > 0 && <Card className="overflow-hidden"><Table rows={categories.data} getRowKey={(row) => row.id} columns={[{ key: "name", header: "Name", render: (row) => <span className="font-semibold">{row.name}</span> }, { key: "description", header: "Description", render: (row) => row.description || "—" }, { key: "actions", header: "", render: (row) => <Button size="sm" variant="ghost" onClick={() => { setEditing(row); setOpen(true); }}>Edit</Button> }]} /></Card>}</div></AppShell><Modal open={open} title={editing ? "Edit category" : "Add category"} onClose={() => setOpen(false)}><CategoryForm initialValues={editing ? { name: editing.name, description: editing.description ?? "" } : undefined} isSaving={categories.isSaving} serverError={categories.saveError?.message} onSubmit={save} onCancel={() => setOpen(false)} /></Modal></>;
}
