import { useState } from "react";
import Head from "next/head";

import { AppShell } from "@/components/layout/AppShell";
import { ProductForm } from "@/components/forms/ProductForm";
import { Alert } from "@/components/ui/Alert";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { Input } from "@/components/ui/Input";
import { LoadingState } from "@/components/ui/LoadingState";
import { Modal } from "@/components/ui/Modal";
import { Pagination } from "@/components/ui/Pagination";
import { Select } from "@/components/ui/Select";
import { Table } from "@/components/ui/Table";
import { useCategories } from "@/features/catalog/use-categories";
import { useProducts, type Product, type ProductFilters } from "@/features/catalog/use-products";
import type { ProductInput } from "@/schemas/catalog";

export default function ProductsPage() {
  const [filters, setFilters] = useState<ProductFilters>({ page: 1, pageSize: 25 });
  const [editing, setEditing] = useState<Product | undefined>();
  const [open, setOpen] = useState(false);
  const [success, setSuccess] = useState(false);
  const categories = useCategories();
  const products = useProducts(filters);
  const save = async (input: ProductInput) => { await products.saveProduct({ id: editing?.id, input }); setEditing(undefined); setOpen(false); setSuccess(true); };
  const totalPages = products.data ? Math.max(1, Math.ceil(products.data.total / products.data.pageSize)) : 1;

  return <><Head><title>Products | Kirana Store Manager</title></Head><AppShell title="Products"><div className="space-y-6"><div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end"><div><p className="text-sm font-semibold text-brand-600">Catalog</p><h2 className="mt-1 text-2xl font-bold text-content">Products</h2><p className="mt-1 text-sm text-content-muted">Manage prices, stock defaults, and product status.</p></div><Button onClick={() => { setEditing(undefined); setOpen(true); }}>Add product</Button></div>{success && <Alert tone="success">Product saved successfully.</Alert>}<Card className="p-4"><div className="grid gap-3 md:grid-cols-[1fr_12rem_12rem]"><Input placeholder="Search by name, SKU, or barcode" value={filters.search ?? ""} onChange={(event) => setFilters((current) => ({ ...current, search: event.target.value, page: 1 }))} /><Select value={filters.categoryId ?? ""} onChange={(event) => setFilters((current) => ({ ...current, categoryId: event.target.value || undefined, page: 1 }))}><option value="">All categories</option>{categories.data?.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</Select><Select value={filters.status ?? ""} onChange={(event) => setFilters((current) => ({ ...current, status: (event.target.value || undefined) as ProductFilters["status"], page: 1 }))}><option value="">All statuses</option><option value="ACTIVE">Active</option><option value="INACTIVE">Inactive</option></Select></div></Card>{products.isPending && <LoadingState label="Loading products…" />}{products.isError && <ErrorState message={products.error.message} onRetry={() => void products.refetch()} />}{products.data && products.data.items.length === 0 && <EmptyState title="No products found" description="Adjust the filters or create your first product." />}{products.data && products.data.items.length > 0 && <><Card className="overflow-hidden"><Table rows={products.data.items} getRowKey={(row) => row.id} columns={[{ key: "sku", header: "SKU", render: (row) => <span className="font-semibold">{row.sku}</span> }, { key: "name", header: "Product", render: (row) => <span>{row.name}</span> }, { key: "category", header: "Category", render: (row) => row.category?.name || "—" }, { key: "mrp", header: "MRP", render: (row) => `₹${row.mrp}` }, { key: "status", header: "Status", render: (row) => <Badge tone={row.status === "ACTIVE" ? "success" : "neutral"}>{row.status}</Badge> }, { key: "actions", header: "", render: (row) => <Button size="sm" variant="ghost" onClick={() => { setEditing(row); setOpen(true); }}>Edit</Button> }]} /></Card><Pagination page={products.data.page} totalPages={totalPages} onPageChange={(page) => setFilters((current) => ({ ...current, page }))} /></>}</div></AppShell><Modal open={open} title={editing ? "Edit product" : "Add product"} onClose={() => setOpen(false)}><ProductForm product={editing} categories={categories.data ?? []} isSaving={products.isSaving} serverError={products.saveError?.message} onSubmit={save} onCancel={() => setOpen(false)} /></Modal></>;
}
