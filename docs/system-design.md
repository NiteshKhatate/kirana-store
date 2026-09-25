# system-design.md

# Kirana Store Manager — Phase 1 System Design

## 1. Purpose

This document defines the technical design for Phase 1 of the Kirana Store Manager.

The system should help a kirana-store owner manage:

- products
- purchases
- sales
- stock
- customer credit
- operational reports

The design prioritizes:

- correctness
- simple operations
- auditability
- desktop productivity
- mobile usability
- future extensibility

---

# 2. Phase 1 Scope

## Included

- authentication
- store/user mapping
- categories
- products
- suppliers
- purchases
- customers
- sales
- inventory
- customer credit
- dashboard
- reports
- tests
- CI/CD
- Docker
- Render deployment

## Excluded

- full accounting
- supplier payable accounts
- GST filing
- purchase orders
- multi-branch support
- expiry/batches
- barcode hardware
- offline-first POS
- loyalty
- WhatsApp/SMS
- advanced forecasting

---

# 3. Technology Stack

## Frontend

- Next.js
- Pages Router
- TypeScript
- Tailwind CSS
- React Hook Form
- Zod
- TanStack React Query

## Backend

- Next.js API Routes
- Prisma ORM

## Database

- Supabase PostgreSQL

## Authentication

- Supabase Auth

## Testing

- Jest
- React Testing Library

## Delivery

- GitHub Actions
- Docker
- Render

---

# 4. Deployment Model

The system is not a pure function-as-a-service application.

Runtime:

```text
Browser
   ↓ HTTPS
Render Web Service
   ↓
Next.js
   ├── Pages
   ├── API Routes
   ├── Service Layer
   └── Prisma
            ↓
      Supabase PostgreSQL
```

Authentication:

```text
Browser
   ↓
Supabase Auth
   ↓
session/token
   ↓
Next.js server authorization
```

---

# 5. High-Level Architecture

```text
┌─────────────────────────────────────┐
│ Browser                             │
│                                     │
│ Next.js Pages                       │
│ React Query                         │
│ React Hook Form                     │
│ Zod                                 │
└──────────────────┬──────────────────┘
                   │
                   │ HTTPS
                   ▼
┌─────────────────────────────────────┐
│ Next.js on Render                   │
│                                     │
│ Pages Router                        │
│ API Routes                          │
│ Authentication Helpers              │
│ Authorization Helpers               │
│ Service Layer                       │
│ Prisma                              │
└───────────────┬─────────────────────┘
                │
                ▼
┌─────────────────────────────────────┐
│ Supabase PostgreSQL                 │
│                                     │
│ Store                               │
│ Users                               │
│ Products                            │
│ Purchases                           │
│ Sales                               │
│ Inventory                           │
│ Credit Ledger                       │
└─────────────────────────────────────┘

Browser / Server
       │
       ▼
┌─────────────────────────────────────┐
│ Supabase Auth                       │
└─────────────────────────────────────┘
```

---

# 6. Application Layers

## Presentation Layer

Responsible for:

- pages
- forms
- tables
- filters
- navigation
- loading states
- error states

Must not contain complex business logic.

---

## Query Layer

TanStack React Query handles:

- data fetching
- caching
- mutation state
- invalidation
- refetching

React Query is the source of truth for server state in the browser.

---

## API Layer

Next.js API Routes handle:

- method validation
- authentication
- authorization
- Zod validation
- request parsing
- service calls
- response formatting

---

## Service Layer

The service layer handles:

- business rules
- transactions
- stock validation
- credit validation
- calculations
- Prisma calls

Examples:

```text
product.service.ts
purchase.service.ts
sale.service.ts
credit.service.ts
inventory.service.ts
report.service.ts
```

---

## Data Layer

Prisma handles application database access.

Supabase PostgreSQL stores application data.

---

# 7. Authentication Model

Supabase Auth owns identity.

Application user records are stored separately.

```text
Supabase auth.users
       │
       │ auth user id
       ▼
User.supabaseUserId
       │
       ▼
StoreMember
       │
       ▼
Store
```

The application `User` table is not a replacement for Supabase Auth.

It contains application-specific identity information and membership relationships.

---

# 8. Authorization Model

Every protected API request follows:

```text
request
↓
Supabase session
↓
authenticated user
↓
User.supabaseUserId
↓
StoreMember
↓
Store
↓
business operation
```

Never authorize based only on:

```text
storeId sent by browser
```

Store ownership/membership must be resolved server-side.

---

# 9. Roles

Phase 1 roles:

```text
OWNER
ADMIN
STAFF
```

Initial rules can be simple:

## OWNER

- full access

## ADMIN

- operational management
- products
- suppliers
- customers
- purchases
- sales
- reports

## STAFF

- products read
- customer read
- sales
- purchases as permitted

Fine-grained permission expansion can be deferred.

---

# 10. Core Domain Model

```text
Store
│
├── StoreMember ─── User
│
├── Category
│    └── Product
│         ├── InventoryBalance
│         ├── InventoryMovement
│         ├── PurchaseItem
│         └── SaleItem
│
├── Supplier
│    └── Purchase
│         └── PurchaseItem
│
└── Customer
     ├── Sale
     │    └── SaleItem
     │
     └── CreditLedgerEntry
```

---

# 11. Product Design

Product is master data.

Important fields:

```text
id
storeId
categoryId
sku
barcode
name
description
unit
mrp
defaultBuyPrice
defaultSellPrice
reorderLevel
status
```

Product prices are defaults.

Historical transactions store price snapshots.

---

# 12. Purchase Design

Purchase represents stock acquired by the store.

Relationship:

```text
Purchase
  ├── supplier
  └── PurchaseItem[]
```

PurchaseItem stores:

```text
product
quantity
buyPrice
mrpAtPurchase
discount
taxRate
lineTotal
```

The historical purchase price must never depend on the current Product record.

---

# 13. Purchase Transaction

A purchase must run atomically:

```text
BEGIN

create Purchase

for each line:
    create PurchaseItem

    create InventoryMovement
        quantityDelta = positive

    increase InventoryBalance

COMMIT
```

If any step fails:

```text
ROLLBACK
```

This prevents:

```text
purchase exists
but stock was not updated
```

or:

```text
stock increased
but purchase was not recorded
```

---

# 14. Sales Design

Sale supports:

- walk-in customers
- regular customers
- fully paid sales
- partially paid sales
- credit sales

Relationship:

```text
Sale
  ├── Customer?
  └── SaleItem[]
```

SaleItem stores:

```text
product
quantity
sellPrice
mrpAtSale
costPriceSnapshot
discount
taxRate
lineTotal
```

---

# 15. Sale Transaction

A completed sale must be atomic:

```text
BEGIN

validate stock

create Sale

for each line:
    create SaleItem

    create InventoryMovement
        quantityDelta = negative

    decrement InventoryBalance

if outstanding amount > 0:
    create CreditLedgerEntry

COMMIT
```

Any error results in rollback.

---

# 16. Inventory Architecture

Do not store only:

```text
Product.quantity
```

Use two structures.

## InventoryMovement

Audit history.

Examples:

```text
+100 PURCHASE
 -10 SALE
  -5 SALE
  +2 ADJUSTMENT_IN
```

## InventoryBalance

Fast current balance.

Example:

```text
quantity = 87
```

Core invariant:

```text
InventoryBalance.quantity
=
SUM(InventoryMovement.quantityDelta)
```

---

# 17. Inventory Concurrency

Browser-side checks are insufficient.

Example problem:

```text
stock = 1

User A sees 1
User B sees 1

A sells 1
B sells 1
```

Without safe server-side transaction logic:

```text
stock = -1
```

The sale service must use a transactional database-safe check/update so simultaneous sales cannot both consume unavailable stock.

Negative stock is not allowed in Phase 1.

---

# 18. Customer Credit Architecture

Credit uses an append-only ledger.

Do not repeatedly mutate one customer balance field.

Use:

```text
CreditLedgerEntry
```

Types:

```text
SALE_CREDIT
PAYMENT
ADJUSTMENT_DEBIT
ADJUSTMENT_CREDIT
```

Convention:

```text
positive amountDelta
=
customer owes more

negative amountDelta
=
customer owes less
```

---

# 19. Credit Example

Credit sale:

```text
sale total     ₹1,000
paid now         ₹600
outstanding      ₹400

ledger:
+₹400 SALE_CREDIT
```

Customer later pays:

```text
₹250

ledger:
-₹250 PAYMENT
```

Outstanding:

```text
₹150
```

Calculation:

```text
openingCredit
+
SUM(CreditLedgerEntry.amountDelta)
```

---

# 20. Credit Limit

If:

```text
Customer.creditLimit != null
```

then before completing a credit sale:

```text
projectedOutstanding
=
currentOutstanding
+
newCreditAmount
```

Require:

```text
projectedOutstanding <= creditLimit
```

Otherwise reject with:

```text
CREDIT_LIMIT_EXCEEDED
```

---

# 21. Pricing and Historical Accuracy

Product stores current defaults:

```text
mrp
defaultBuyPrice
defaultSellPrice
```

Transactions store snapshots.

Purchase:

```text
buyPrice
mrpAtPurchase
```

Sale:

```text
sellPrice
mrpAtSale
costPriceSnapshot
```

Therefore:

```text
changing today's Product price
```

does not alter:

```text
last month's report
```

---

# 22. Gross Profit

Phase 1 estimated gross profit:

```text
SaleItem revenue
-
SaleItem cost
```

Example:

```text
quantity = 5
sellPrice = ₹20
costPriceSnapshot = ₹15

revenue = ₹100
cost = ₹75
gross profit = ₹25
```

Persist `costPriceSnapshot` when sale occurs.

Do not derive old sales costs from the current Product buying price.

---

# 23. API Structure

Suggested API routes:

```text
/api/health

/api/categories
/api/categories/:id

/api/products
/api/products/:id

/api/suppliers
/api/suppliers/:id

/api/customers
/api/customers/:id
/api/customers/:id/credit
/api/customers/:id/payments

/api/purchases
/api/purchases/:id

/api/sales
/api/sales/:id

/api/inventory

/api/reports/dashboard
/api/reports/inventory
/api/reports/sales
/api/reports/purchases
/api/reports/credit
```

---

# 24. API Response Contract

Success:

```json
{
  "data": {},
  "error": null
}
```

Failure:

```json
{
  "data": null,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request"
  }
}
```

Stable business error codes:

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

---

# 25. Validation

Use Zod on:

- browser forms
- API routes

Do not rely only on browser validation.

## Product

```text
sku required
name required
mrp >= 0
buying price >= 0
selling price >= 0
reorder level >= 0
```

## Purchase

```text
at least one item
quantity > 0
buy price >= 0
product belongs to store
```

## Sale

```text
at least one item
quantity > 0
sell price >= 0
amount paid >= 0
amount paid <= total
stock available
credit requires customer
```

## Credit Payment

```text
amount > 0
customer belongs to store
```

---

# 26. React Query Design

Suggested query keys:

```ts
["categories"]

["products", filters]
["product", id]

["suppliers", filters]

["purchases", filters]
["purchase", id]

["customers", filters]
["customer", id]
["customer-credit", id]

["sales", filters]
["sale", id]

["inventory", filters]

["dashboard-summary", range]

["reports", type, filters]
```

Do not duplicate server data into another global state library.

---

# 27. Forms

Use:

```text
React Hook Form
+
Zod
+
zodResolver
```

Every business form should support:

- field errors
- server errors
- disabled submit
- loading state
- retained user input after recoverable errors

---

# 28. UI Design System

The app is desktop-first but mobile-friendly.

## Desktop

Preferred shell:

```text
sidebar: 240–264px
topbar: approximately 64px
page padding: 24–32px
content max width: approximately 1600px
```

Use dense but readable tables.

---

## Mobile

On smaller screens:

```text
sidebar → drawer
multi-column form → single column
toolbar → wrapped/stacked
table → scroll or responsive cards
page padding → smaller
```

No accidental body overflow.

---

# 29. Tailwind Design Tokens

Components should use semantic names.

Example:

```tsx
bg-surface
bg-surface-muted
text-content
text-content-muted
border-border
bg-brand-600
text-success-700
text-danger-700
```

Avoid:

```tsx
bg-[#ffffff]
text-[#172033]
```

inside feature components.

Centralize:

- colors
- typography
- radius
- shadows
- spacing conventions
- control sizing

---

# 30. Shared Components

Phase 1 shared components:

```text
Button
Input
Select
Textarea
Checkbox
FormField
Card
Badge
Alert
Modal
Table
Pagination
EmptyState
LoadingState
ErrorState
```

---

# 31. Reporting

## Dashboard

```text
today's sales
today's purchase value
outstanding customer credit
low-stock count
inventory value estimate
```

## Inventory

```text
current quantity
reorder level
low stock
out of stock
inventory cost value
MRP value
```

## Sales

```text
date range
sales total
payment methods
credit sales
product totals
gross profit estimate
```

## Purchases

```text
date range
purchase total
supplier filter
product totals
```

## Credit

```text
customer
outstanding
ledger
payments
date range
```

---

# 32. Performance

Use database indexes for:

- store + product name
- store + SKU
- sales by date
- purchases by date
- customer credit history
- product inventory history

Paginate:

- products
- customers
- purchases
- sales

Do not fetch entire transaction history into the browser.

---

# 33. Security

Never expose:

```text
DATABASE_URL
Supabase secret key
server credentials
```

Browser-safe:

```text
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
```

Server must validate:

- authentication
- store membership
- product ownership
- customer ownership
- stock
- totals
- credit rules

---

# 34. Error Handling

Expected business errors should be returned cleanly.

Example:

```text
INSUFFICIENT_STOCK
```

should not appear as an unknown 500 error.

Unexpected failures should:

- be logged server-side
- return generic user-safe messages
- not expose database details

---

# 35. Testing Strategy

## Unit

- calculations
- Zod schemas
- credit balance
- total calculations

## Service

- purchase transaction
- sale transaction
- credit payment
- inventory update

## API

- authentication
- authorization
- validation
- business errors

## UI

- main forms
- loading states
- error states

---

# 36. CI Pipeline

```text
GitHub push / PR
       ↓
npm ci
       ↓
Prisma generate
       ↓
Prisma validate
       ↓
ESLint
       ↓
TypeScript
       ↓
Jest
       ↓
Next.js build
```

Merge only when CI passes.

---

# 37. Docker

Docker image should:

- install dependencies
- generate Prisma Client
- build Next.js
- run production Next.js
- expose port 3000
- receive environment variables at runtime

Do not bake secrets into the image.

---

# 38. Render

Deployment:

```text
GitHub
↓
Render Web Service
↓
Dockerfile
↓
Next.js
↓
Supabase
```

Required Render environment variables:

```text
DATABASE_URL
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
```

Additional secret variables may be added later if server-side Supabase administration becomes necessary.

---

# 39. Health Check

Create:

```text
GET /api/health
```

Response should indicate:

```json
{
  "status": "ok"
}
```

Optionally include DB status.

Do not expose secrets or internal connection information.

---

# 40. Observability

Phase 1 minimum:

- Render logs
- Supabase logs
- API server error logs
- health endpoint

Future:

- Sentry
- OpenTelemetry
- metrics

---

# 41. Data Integrity Invariants

These must always hold.

## Inventory

```text
InventoryBalance
=
inventory movement total
```

## Sale

```text
completed sale cannot exceed stock
```

## Credit

```text
credit sale requires customer
```

## Store Security

```text
user cannot access another store's data
```

## Historical Pricing

```text
transaction snapshots never change when Product prices change
```

---

# 42. Phase 1 Completion Criteria

Phase 1 is complete when:

```text
authentication works
products work
suppliers work
purchases work
inventory updates correctly
customers work
sales work
customer credit works
reports work
tests pass
CI passes
Docker works
Render deployment works
desktop UI is complete
mobile UI is usable
```

---

# 43. Future Extension Points

The Phase 1 model should later accommodate:

- returns
- expiry
- batches
- barcode scanning
- supplier payable ledger
- purchase orders
- GST enhancements
- multiple branches
- stock transfers
- advanced costing
- offline mode
- loyalty
- notifications
- analytics
- forecasting

These are intentionally outside Phase 1.
