import { useState } from "react";
import Head from "next/head";
import { AppShell } from "@/components/layout/AppShell";
import { SaleForm } from "@/components/forms/SaleForm";
import { Alert } from "@/components/ui/Alert";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { LoadingState } from "@/components/ui/LoadingState";
import { Modal } from "@/components/ui/Modal";
import { Table } from "@/components/ui/Table";
import { useProducts } from "@/features/catalog/use-products";
import { useCustomers } from "@/features/customers/use-customers";
import { useSales, type SaleFilters } from "@/features/sales/use-sales";
import type { SaleInput } from "@/schemas/catalog";
export default function SalesPage() { const [filters] = useState<SaleFilters>({ page: 1, pageSize: 25 }); const [open, setOpen] = useState(false); const [success, setSuccess] = useState(false); const sales = useSales(filters); const products = useProducts({ page: 1, pageSize: 100 }); const customers = useCustomers({ page: 1, pageSize: 100 }); const save = async (input: SaleInput) => { await sales.createSale(input); setOpen(false); setSuccess(true); }; return <><Head><title>Sales | Kirana Store Manager</title></Head><AppShell title="Sales"><div className="space-y-6"><div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end"><div><p className="text-sm font-semibold text-brand-600">Stock-out</p><h2 className="mt-1 text-2xl font-bold text-content">Sales</h2><p className="mt-1 text-sm text-content-muted">Sell stock, validate inventory, and track credit.</p></div><Button onClick={() => setOpen(true)}>Record sale</Button></div>{success && <Alert tone="success">Sale completed and inventory updated.</Alert>}{sales.isPending && <LoadingState label="Loading sales…" />}{sales.isError && <ErrorState message={sales.error.message} onRetry={() => void sales.refetch()} />}{sales.data?.items.length === 0 && <EmptyState title="No sales yet" description="Record your first sale." />}{sales.data && sales.data.items.length > 0 && <Card className="overflow-hidden"><Table rows={sales.data.items} getRowKey={(row) => row.id} columns={[{ key: "number", header: "Sale", render: (row) => row.saleNumber }, { key: "date", header: "Date", render: (row) => new Date(row.saleDate).toLocaleDateString() }, { key: "customer", header: "Customer", render: (row) => row.customer?.name || "Walk-in" }, { key: "total", header: "Total", render: (row) => `₹${row.total}` }, { key: "status", header: "Payment", render: (row) => <Badge tone={row.paymentStatus === "PAID" ? "success" : "warning"}>{row.paymentStatus}</Badge> }]} /></Card>}</div></AppShell><Modal open={open} title="Record sale" onClose={() => setOpen(false)}><SaleForm products={products.data?.items ?? []} customers={customers.data?.items ?? []} isSaving={sales.isSaving} serverError={sales.saveError?.message} onSubmit={save} onCancel={() => setOpen(false)} /></Modal></>; }
