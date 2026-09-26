import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { supplierSchema, type SupplierInput } from "@/schemas/catalog";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";

export function SupplierForm({ initialValues, isSaving, serverError, onSubmit, onCancel }: { initialValues?: SupplierInput; isSaving: boolean; serverError?: string; onSubmit: (values: SupplierInput) => Promise<void>; onCancel: () => void }) {
  const { register, reset, handleSubmit, formState: { errors } } = useForm<SupplierInput>({ resolver: zodResolver(supplierSchema), defaultValues: initialValues ?? { name: "", phone: "", address: "", gstNumber: "" } });
  useEffect(() => { reset(initialValues ?? { name: "", phone: "", address: "", gstNumber: "" }); }, [initialValues, reset]);
  return <form className="space-y-5" onSubmit={(event) => void handleSubmit(onSubmit)(event)}>
    <FormField label="Name" htmlFor="supplier-name" error={errors.name?.message}><Input id="supplier-name" autoFocus {...register("name")} /></FormField>
    <FormField label="Phone" htmlFor="supplier-phone" error={errors.phone?.message}><Input id="supplier-phone" {...register("phone")} /></FormField>
    <FormField label="GST number" htmlFor="supplier-gst" error={errors.gstNumber?.message}><Input id="supplier-gst" {...register("gstNumber")} /></FormField>
    <FormField label="Address" htmlFor="supplier-address" error={errors.address?.message}><Textarea id="supplier-address" {...register("address")} /></FormField>
    {serverError && <Alert tone="danger">{serverError}</Alert>}
    <div className="flex justify-end gap-3"><Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button><Button type="submit" disabled={isSaving}>{isSaving ? "Saving…" : "Save supplier"}</Button></div>
  </form>;
}
