import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { categorySchema, type CategoryInput } from "@/schemas/catalog";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";

export function CategoryForm({ initialValues, isSaving, serverError, onSubmit, onCancel }: { initialValues?: CategoryInput; isSaving: boolean; serverError?: string; onSubmit: (values: CategoryInput) => Promise<void>; onCancel: () => void }) {
  const { register, reset, handleSubmit, formState: { errors } } = useForm<CategoryInput>({ resolver: zodResolver(categorySchema), defaultValues: initialValues ?? { name: "", description: "" } });
  useEffect(() => { reset(initialValues ?? { name: "", description: "" }); }, [initialValues, reset]);

  return <form className="space-y-5" onSubmit={(event) => void handleSubmit(onSubmit)(event)}>
    <FormField label="Name" htmlFor="category-name" error={errors.name?.message}><Input id="category-name" autoFocus {...register("name")} /></FormField>
    <FormField label="Description" htmlFor="category-description" error={errors.description?.message}><Textarea id="category-description" {...register("description")} /></FormField>
    {serverError && <Alert tone="danger">{serverError}</Alert>}
    <div className="flex justify-end gap-3"><Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button><Button type="submit" disabled={isSaving}>{isSaving ? "Saving…" : "Save category"}</Button></div>
  </form>;
}
