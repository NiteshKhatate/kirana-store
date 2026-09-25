import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { ProductForm } from "@/components/forms/ProductForm";

describe("ProductForm", () => {
  it("shows validation errors before submitting", async () => {
    const user = userEvent.setup();
    const onSubmit = jest.fn();

    render(<ProductForm categories={[]} isSaving={false} onSubmit={onSubmit} onCancel={jest.fn()} />);
    await user.click(screen.getByRole("button", { name: "Save product" }));

    expect(screen.getByText("SKU is required")).toBeInTheDocument();
    expect(screen.getByText("Product name is required")).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });
});
