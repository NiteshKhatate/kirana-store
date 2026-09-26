import { render, screen } from "@testing-library/react";
import { PurchaseForm } from "@/components/forms/PurchaseForm";
import { SaleForm } from "@/components/forms/SaleForm";
import { CustomerForm } from "@/components/forms/CustomerForm";
import { CreditPaymentForm } from "@/components/forms/CreditPaymentForm";

const noop = async () => undefined;

describe("operation forms", () => {
  it("renders purchase and sale forms", () => { const { rerender } = render(<PurchaseForm products={[]} suppliers={[]} isSaving={false} onSubmit={noop} onCancel={noop} />); expect(screen.getByText("Complete purchase")).toBeInTheDocument(); rerender(<SaleForm products={[]} customers={[]} isSaving={false} onSubmit={noop} onCancel={noop} />); expect(screen.getByText("Complete sale")).toBeInTheDocument(); });
  it("renders customer and credit payment forms", () => { const { rerender } = render(<CustomerForm isSaving={false} onSubmit={noop} onCancel={noop} />); expect(screen.getByText("Save customer")).toBeInTheDocument(); rerender(<CreditPaymentForm isSaving={false} onSubmit={noop} onCancel={noop} />); expect(screen.getByText("Record payment")).toBeInTheDocument(); });
});
