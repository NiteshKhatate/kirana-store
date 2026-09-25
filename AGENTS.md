# AGENTS.md

## Project

Kirana Store Manager — Phase 1

## Objective

Build a reliable Phase 1 kirana-store management application in one Agile sprint.

The application must support:

1. Product master and categories
2. Purchases and stock-in
3. Sales and stock-out
4. Regular-customer credit accounts
5. Current inventory
6. Operational reports
7. Authentication and store-level access control
8. Automated tests
9. CI/CD
10. Docker deployment to Render

Do not implement Phase 2 functionality unless it is required to make Phase 1 correct.

---

## Required Technology

Use the following stack unless explicitly changed:

- Next.js
- Pages Router
- TypeScript
- npm
- Tailwind CSS
- Supabase Postgres
- Supabase Auth
- Prisma ORM
- React Hook Form
- Zod
- TanStack React Query
- Jest
- React Testing Library
- GitHub Actions
- Docker
- Render

Do not migrate the project to App Router.

Do not replace Prisma with Supabase database queries for core application CRUD.

Use Supabase primarily for:

- PostgreSQL
- authentication
- project hosting services needed later

Use Prisma for application database access.

---

## Current Phase Status

Already completed:

- [x] Next.js project created
- [x] Pages Router selected
- [x] npm selected
- [x] Supabase project created
- [x] Phase 1 database tables created in Supabase
- [x] Prisma package installed
- [x] Prisma Client generated
- [x] Supabase client file created
- [x] Prisma client file created

Still to complete:

- [ ] Prisma introspection verification
- [ ] React Query setup
- [ ] authentication flow
- [ ] application shell
- [ ] design system
- [ ] products
- [ ] suppliers
- [ ] purchases
- [ ] customers
- [ ] sales
- [ ] credit ledger
- [ ] inventory
- [ ] reports
- [ ] tests
- [ ] CI/CD
- [ ] Docker
- [ ] Render deployment

---

## Architecture Rules

Use a layered structure.

Recommended structure:

```text
components/
  ui/
  forms/
  tables/
  layout/

features/
  products/
  categories/
  suppliers/
  purchases/
  customers/
  sales/
  credit/
  inventory/
  reports/

lib/
  prisma.ts
  supabase.ts
  query-client.ts

pages/
  api/
  products/
  purchases/
  customers/
  sales/
  inventory/
  reports/

schemas/
services/
types/
utils/
styles/
```

Do not put business logic directly inside React components.

Use:

```text
UI
↓
React Query hook
↓
API route
↓
service
↓
Prisma
↓
Supabase Postgres
```

---

## Database Rules

The database already exists in Supabase.

Prisma is being used as an ORM over the existing database.

Use:

```bash
npx prisma db pull
npx prisma generate
```

Do not create or modify production tables manually from application code.

For future schema changes, first update the database deliberately, then introspect Prisma again unless the team later decides to adopt Prisma Migrate fully.

Do not run destructive Prisma reset commands against Supabase.

Never run:

```bash
npx prisma migrate reset
```

against the shared Supabase project.

---

## Multi-store Rule

Every business entity belongs to a Store either directly or indirectly.

Never trust `storeId` sent by the browser.

Resolve the current user and store membership on the server.

Expected authorization flow:

```text
Supabase session
↓
User.supabaseUserId
↓
StoreMember
↓
Store
↓
authorized data
```

Every query for store-owned data must scope by the authenticated store.

---

## Product Rules

A product includes:

- SKU
- optional barcode
- name
- category
- unit
- MRP
- default buying price
- default selling price
- reorder level
- active/inactive status

SKU must be unique per store.

Barcode should be unique per store when present.

Do not use JavaScript floating point for persisted monetary calculations.

Use Prisma Decimal-compatible handling for money and quantities.

---

## Purchase Rules

A completed purchase must:

1. create Purchase
2. create PurchaseItem rows
3. create positive InventoryMovement rows
4. update InventoryBalance
5. commit all changes atomically

The entire operation must run in a Prisma transaction.

Never update stock separately from the purchase transaction.

Store historical values in PurchaseItem:

- quantity
- buying price
- MRP at purchase
- discount
- tax rate
- line total

---

## Sale Rules

A completed sale must:

1. validate products
2. validate stock
3. create Sale
4. create SaleItem rows
5. create negative InventoryMovement rows
6. decrement InventoryBalance
7. create credit ledger entry if money remains due
8. commit atomically

A sale must not result in negative stock in Phase 1.

Do not rely only on browser-side stock validation.

Stock must be validated again on the server.

For concurrency-sensitive writes, use a database-safe transactional approach.

---

## Inventory Rules

`InventoryMovement` is the audit history.

`InventoryBalance` is the current balance cache.

Invariant:

```text
InventoryBalance.quantity
=
SUM(InventoryMovement.quantityDelta)
```

Do not directly modify inventory quantity from UI code.

All inventory changes must produce an InventoryMovement.

Phase 1 movement types include:

- PURCHASE
- SALE
- SALE_RETURN
- PURCHASE_RETURN
- ADJUSTMENT_IN
- ADJUSTMENT_OUT
- OPENING_STOCK

Returns can remain unused in UI until a later phase.

---

## Customer Credit Rules

Customer credit is ledger-based.

Do not store and repeatedly overwrite a simple outstanding balance.

Use `CreditLedgerEntry`.

Positive amountDelta:

```text
customer owes more
```

Negative amountDelta:

```text
customer owes less
```

Examples:

```text
credit sale        +500
payment            -200
adjustment debit   +100
adjustment credit   -50
```

Outstanding credit must be calculated from:

```text
openingCredit
+
sum(CreditLedgerEntry.amountDelta)
```

A credit sale must require a customer.

If a customer has a credit limit, validate the projected outstanding balance before completing the sale.

---

## Pricing Rules

Product prices are defaults only.

Historical transaction rows must preserve price snapshots.

PurchaseItem stores:

- buyPrice
- mrpAtPurchase

SaleItem stores:

- sellPrice
- mrpAtSale
- costPriceSnapshot

Changing Product prices must never alter historical reports.

---

## API Rules

API routes must follow this order:

1. verify HTTP method
2. authenticate user
3. resolve Store membership
4. validate request using Zod
5. call service layer
6. perform database transaction if required
7. return normalized response

Suggested response format:

```ts
type ApiSuccess<T> = {
  data: T;
  error: null;
};

type ApiError = {
  data: null;
  error: {
    code: string;
    message: string;
    fieldErrors?: Record<string, string[]>;
  };
};
```

Stable error codes should include:

```text
UNAUTHORIZED
FORBIDDEN
VALIDATION_ERROR
NOT_FOUND
DUPLICATE_SKU
INSUFFICIENT_STOCK
CREDIT_LIMIT_EXCEEDED
INVALID_PAYMENT
CONFLICT
INTERNAL_ERROR
```

Do not expose internal stack traces to the browser.

---

## React Query Rules

Use TanStack React Query for server state.

Suggested query keys:

```ts
["products", filters]
["product", id]
["categories"]
["suppliers", filters]
["purchases", filters]
["purchase", id]
["customers", filters]
["customer", id]
["customer-credit", customerId]
["sales", filters]
["sale", id]
["inventory", filters]
["dashboard-summary", dateRange]
["reports", reportType, filters]
```

Invalidate only affected query families after mutations.

Do not use optimistic updates for:

- purchases
- sales
- inventory
- customer credit

in Phase 1.

---

## Form Rules

All business forms use:

- React Hook Form
- Zod
- zodResolver

Validation must run on both:

- client
- server

Reuse shared Zod schemas where possible.

Forms must include:

- visible labels
- inline validation errors
- submit loading state
- disabled state while submitting
- recoverable server error display
- confirmation before destructive actions

---

## UI / Design System Rules

The application is desktop-first but mobile-friendly.

Desktop priorities:

- data-dense tables
- clear filters
- efficient forms
- visible actions
- keyboard-friendly controls

Mobile requirements:

- no accidental horizontal page overflow
- forms become single column
- toolbars may wrap
- tables may use controlled horizontal scroll or responsive cards
- touch targets remain usable

Use centralized Tailwind tokens.

Do not add arbitrary component hex colors.

Preferred semantic classes:

```text
bg-surface
bg-surface-muted
text-content
text-content-muted
border-border
bg-brand-600
text-danger-700
text-success-700
```

Standardize:

- font family
- font sizes
- button heights
- input heights
- border radius
- backgrounds
- borders
- status colors
- spacing
- shadows

Create reusable components for:

- Button
- Input
- Select
- Textarea
- Checkbox
- FormField
- Card
- Badge
- Alert
- Modal
- Table
- EmptyState
- LoadingState

Do not restyle the same type of control individually on every page.

---

## Testing Rules

Critical business logic must have automated tests.

Minimum test areas:

### Products

- required validation
- duplicate SKU
- valid prices
- store isolation

### Purchases

- totals
- stock increase
- rollback on failure

### Sales

- totals
- stock decrease
- insufficient stock rejection
- credit-sale behavior
- rollback on failure

### Credit

- credit sale entry
- repayment entry
- outstanding balance
- credit limit

### APIs

- unauthorized access
- forbidden cross-store access
- validation errors
- expected business errors

### UI

- major form validation
- submit/loading states
- error rendering

Test behavior, not implementation details.

---

## Security Rules

Never expose:

- DATABASE_URL
- Supabase secret keys
- internal server credentials

Browser-safe variables may use:

```text
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
```

Never expose a secret key with `NEXT_PUBLIC_`.

Never trust:

- storeId
- inventory quantity
- credit balance
- price totals

from the browser without server validation.

---

## Git Rules

Recommended branches:

```text
main
develop
feature/<ticket>-<short-name>
fix/<ticket>-<short-name>
```

Commit examples:

```text
feat(products): add product creation
feat(purchases): add stock-in transaction
fix(sales): prevent negative inventory
test(credit): add repayment ledger tests
docs(system): update inventory flow
```

Do not commit secrets.

Do not commit `.env`.

---

## Definition of Done

A feature is complete only when:

- UI exists
- server/API exists
- Zod validation exists
- authorization exists
- database operation is correct
- loading state exists
- empty state exists where relevant
- error state exists
- desktop layout checked
- mobile layout checked
- tests added
- build passes
- lint passes
- docs updated if architecture changed

---

## Phase 1 Scope Guard

Do not implement these unless explicitly promoted into Phase 1:

- GST filing
- accounting ledger
- supplier payable ledger
- multi-branch transfer
- barcode hardware integration
- WhatsApp/SMS automation
- loyalty points
- payroll
- e-commerce
- advanced forecasting
- AI features
- offline-first mode
- expiry/batch management
- purchase orders
