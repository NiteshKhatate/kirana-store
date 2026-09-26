import { useState } from "react";
import Head from "next/head";

import { AppShell } from "@/components/layout/AppShell";
import { SupplierForm } from "@/components/forms/SupplierForm";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { Input } from "@/components/ui/Input";
import { LoadingState } from "@/components/ui/LoadingState";
import { Modal } from "@/components/ui/Modal";
import { Pagination } from "@/components/ui/Pagination";
import { Table } from "@/components/ui/Table";
import { useSuppliers, type Supplier, type SupplierFilters } from "@/features/suppliers/use-suppliers";
import type { SupplierInput } from "@/schemas/catalog";

export default function SuppliersPage() {
  const [filters, setFilters] = useState<SupplierFilters>({ page: 1, pageSize: 25 });
  const [editing, setEditing] = useState<Supplier | undefined>();
  const [open, setOpen] = useState(false);
  const [success, setSuccess] = useState(false);
  const suppliers = useSuppliers(filters);
  const save = async (input: SupplierInput) => { await suppliers.saveSupplier({ id: editing?.id, input }); setEditing(undefined); setOpen(false); setSuccess(true); };
  const totalPages = suppliers.data ? Math.max(1, Math.ceil(suppliers.data.total / suppliers.data.pageSize)) : 1;
  return <><Head><title>Suppliers | Kirana Store Manager</title></Head><AppShell title="Suppliers"><div className="space-y-6"><div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end"><div><p className="text-sm font-semibold text-brand-600">Purchasing</p><h2 className="mt-1 text-2xl font-bold text-content">Suppliers</h2><p className="mt-1 text-sm text-content-muted">Keep supplier contacts ready for stock-in.</p></div><Button onClick={() => { setEditing(undefined); setOpen(true); }}>Add supplier</Button></div>{success && <Alert tone="success">Supplier saved successfully.</Alert>}<Card className="p-4"><Input placeholder="Search by name, phone, or GST number" value={filters.search ?? ""} onChange={(event) => setFilters((current) => ({ ...current, search: event.target.value, page: 1 }))} /></Card>{suppliers.isPending && <LoadingState label="Loading suppliers…" />}{suppliers.isError && <ErrorState message={suppliers.error.message} onRetry={() => void suppliers.refetch()} />}{suppliers.data && suppliers.data.items.length === 0 && <EmptyState title="No suppliers found" description="Adjust the search or add your first supplier." />}{suppliers.data && suppliers.data.items.length > 0 && <><Card className="overflow-hidden"><Table rows={suppliers.data.items} getRowKey={(row) => row.id} columns={[{ key: "name", header: "Name", render: (row) => <span className="font-semibold">{row.name}</span> }, { key: "phone", header: "Phone", render: (row) => row.phone || "—" }, { key: "gstNumber", header: "GST number", render: (row) => row.gstNumber || "—" }, { key: "address", header: "Address", render: (row) => row.address || "—" }, { key: "actions", header: "", render: (row) => <Button size="sm" variant="ghost" onClick={() => { setEditing(row); setOpen(true); }}>Edit</Button> }]} /></Card><Pagination page={suppliers.data.page} totalPages={totalPages} onPageChange={(page) => setFilters((current) => ({ ...current, page }))} /></>}</div></AppShell><Modal open={open} title={editing ? "Edit supplier" : "Add supplier"} onClose={() => setOpen(false)}><SupplierForm initialValues={editing ? { name: editing.name, phone: editing.phone ?? "", address: editing.address ?? "", gstNumber: editing.gstNumber ?? "" } : undefined} isSaving={suppliers.isSaving} serverError={suppliers.saveError?.message} onSubmit={save} onCancel={() => setOpen(false)} /></Modal></>;
}
