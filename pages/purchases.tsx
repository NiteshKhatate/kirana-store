import { useState } from "react";
import Head from "next/head";
import { AppShell } from "@/components/layout/AppShell";
import { PurchaseForm } from "@/components/forms/PurchaseForm";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { LoadingState } from "@/components/ui/LoadingState";
import { Modal } from "@/components/ui/Modal";
import { Table } from "@/components/ui/Table";
import { useProducts } from "@/features/catalog/use-products";
import { useSuppliers } from "@/features/suppliers/use-suppliers";
import { usePurchases, type PurchaseFilters } from "@/features/purchases/use-purchases";
import type { PurchaseInput } from "@/schemas/catalog";
export default function PurchasesPage() { const [filters] = useState<PurchaseFilters>({ page: 1, pageSize: 25 }); const [open, setOpen] = useState(false); const [success, setSuccess] = useState(false); const purchases = usePurchases(filters); const products = useProducts({ page: 1, pageSize: 100 }); const suppliers = useSuppliers({ page: 1, pageSize: 100 }); const save = async (input: PurchaseInput) => { await purchases.createPurchase(input); setOpen(false); setSuccess(true); }; return <><Head><title>Purchases | Kirana Store Manager</title></Head><AppShell title="Purchases"><div className="space-y-6"><div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end"><div><p className="text-sm font-semibold text-brand-600">Stock-in</p><h2 className="mt-1 text-2xl font-bold text-content">Purchases</h2><p className="mt-1 text-sm text-content-muted">Receive stock and update inventory atomically.</p></div><Button onClick={() => setOpen(true)}>Record purchase</Button></div>{success && <Alert tone="success">Purchase completed and stock updated.</Alert>}{purchases.isPending && <LoadingState label="Loading purchases…" />}{purchases.isError && <ErrorState message={purchases.error.message} onRetry={() => void purchases.refetch()} />}{purchases.data?.items.length === 0 && <EmptyState title="No purchases yet" description="Record your first stock-in transaction." />}{purchases.data && purchases.data.items.length > 0 && <Card className="overflow-hidden"><Table rows={purchases.data.items} getRowKey={(row) => row.id} columns={[{ key: "date", header: "Date", render: (row) => new Date(row.purchaseDate).toLocaleDateString() }, { key: "invoice", header: "Invoice", render: (row) => row.invoiceNumber || "—" }, { key: "supplier", header: "Supplier", render: (row) => row.supplier?.name || "Walk-in" }, { key: "total", header: "Total", render: (row) => `₹${row.total}` }]} /></Card>}</div></AppShell><Modal open={open} title="Record purchase" onClose={() => setOpen(false)}><PurchaseForm products={products.data?.items ?? []} suppliers={suppliers.data?.items ?? []} isSaving={purchases.isSaving} serverError={purchases.saveError?.message} onSubmit={save} onCancel={() => setOpen(false)} /></Modal></>; }
