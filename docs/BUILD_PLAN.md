# BUILD_PLAN.md

## Kirana Store Manager — Phase 1

## Sprint Goal

Deliver a deployable Phase 1 kirana-store management application that supports:

- product management
- purchases
- sales
- stock tracking
- customer credit
- operational reporting
- authentication
- tests
- CI/CD
- Docker
- Render deployment

---

# Progress Legend

Use these markers throughout the project:

```text
[x] Complete
[~] In progress
[ ] Not started
[!] Blocked
[-] Deferred
```

Overall progress should be reviewed at the end of each work session.

---

# Stage 0 — Project Foundation

## 0.1 Project Creation

- [x] Create Next.js project
- [x] Use TypeScript
- [x] Use Pages Router
- [x] Use npm
- [x] Enable ESLint
- [x] Install Tailwind
- [x] Configure import aliases
- [x] Confirm `npm run dev` works

## 0.2 Core Dependencies

- [x] Install Supabase JS
- [x] Install Prisma
- [x] Install Prisma PostgreSQL adapter
- [x] Install PostgreSQL driver
- [x] Install React Hook Form
- [x] Install Zod
- [x] Install Hook Form resolvers
- [x] Install TanStack React Query
- [x] Install Jest packages
- [x] Install React Testing Library packages

## 0.3 Base Project Structure

- [x] Create `components/`
- [x] Create `components/ui/`
- [x] Create `components/forms/`
- [x] Create `components/tables/`
- [x] Create `components/layout/`
- [x] Create `features/`
- [x] Create `lib/`
- [x] Create `schemas/`
- [x] Create `services/`
- [x] Create `types/`
- [x] Create `utils/`

### Stage 0 status

**Current:** Complete

---

# Stage 1 — Database Foundation

## 1.1 Supabase

- [x] Create Supabase project
- [x] Configure database password
- [x] Configure database connection string
- [x] Confirm database connectivity
- [x] Create Phase 1 database tables
- [x] Create enums
- [x] Create foreign keys
- [x] Create indexes

## 1.2 Prisma

- [x] Initialize Prisma
- [x] Configure Prisma
- [x] Create `lib/prisma.ts`
- [x] Generate Prisma Client
- [x] Run `npx prisma db pull` after final schema verification
- [x] Review introspected Prisma schema
- [x] Run `npx prisma generate` after introspection
- [x] Test one simple Prisma query
- [x] Confirm app can read database data

## 1.3 Core Database Verification

Verify tables:

- [x] Store
- [x] User
- [x] StoreMember
- [x] Category
- [x] Product
- [x] InventoryBalance
- [x] Supplier
- [x] Purchase
- [x] PurchaseItem
- [x] Customer
- [x] Sale
- [x] SaleItem
- [x] InventoryMovement
- [x] CreditLedgerEntry

Verify core constraints:

- [x] SKU unique per store
- [x] barcode unique per store
- [x] sale number unique per store
- [x] product → store FK
- [x] purchase → supplier FK
- [x] purchase item → product FK
- [x] sale → customer FK
- [x] inventory movement → product FK
- [x] credit ledger → customer FK

### Stage 1 status

**Current:** Complete

---

# Stage 2 — Application Infrastructure

## 2.1 Supabase Client

- [x] Create `lib/supabase.ts`
- [x] Configure Supabase URL
- [x] Configure publishable key
- [x] Verify browser Supabase client

## 2.2 React Query

- [x] Create `lib/query-client.ts`
- [x] Add `QueryClientProvider` in `_app.tsx`
- [x] Define query-key conventions
- [x] Verify sample query
- [x] Verify mutation invalidation

## 2.3 API Foundation

- [x] Define success response shape
- [x] Define error response shape
- [x] Create API error helper
- [x] Create method validation helper
- [x] Create server-side auth helper
- [x] Create store-membership helper
- [x] Create reusable Zod validation helper

## 2.4 Health Endpoint

- [x] Create `/api/health`
- [x] Return app status
- [x] Add database connectivity check
- [x] Test locally

### Stage 2 status

**Current:** Complete

---

# Stage 3 — Authentication and Store Bootstrap

## 3.1 Authentication

- [ ] Create login page
- [ ] Add email/password sign-in
- [ ] Handle authentication errors
- [ ] Handle session restoration
- [ ] Add logout
- [ ] Protect authenticated pages
- [ ] Protect API routes

## 3.2 Local User Mapping

- [ ] Map Supabase Auth user to `User`
- [ ] Create application User on first login/admin bootstrap
- [ ] Store `supabaseUserId`
- [ ] Resolve current StoreMember
- [ ] Resolve current Store

## 3.3 Initial Store Setup

- [ ] Create initial Store
- [ ] Create OWNER membership
- [ ] Verify owner can access the store
- [ ] Verify unauthenticated users cannot access store data
- [ ] Verify cross-store access is rejected

### Stage 3 status

**Current:** Not started

---

# Stage 4 — UI Design System

## 4.1 Tailwind Theme

Define semantic color names:

- [ ] brand colors
- [ ] surface colors
- [ ] content/text colors
- [ ] border colors
- [ ] success colors
- [ ] warning colors
- [ ] danger colors
- [ ] info colors

## 4.2 Typography

- [ ] font family
- [ ] display sizes
- [ ] page heading
- [ ] section heading
- [ ] body
- [ ] body small
- [ ] caption

## 4.3 Shared UI Tokens

- [ ] button heights
- [ ] input heights
- [ ] card radius
- [ ] control radius
- [ ] card shadow
- [ ] page background
- [ ] content width
- [ ] sidebar width
- [ ] spacing conventions

## 4.4 Reusable UI Components

- [ ] Button
- [ ] Input
- [ ] Select
- [ ] Textarea
- [ ] Checkbox
- [ ] FormField
- [ ] Card
- [ ] Badge
- [ ] Alert
- [ ] Modal
- [ ] Table
- [ ] Pagination
- [ ] EmptyState
- [ ] LoadingState
- [ ] ErrorState

## 4.5 Application Shell

- [ ] sidebar
- [ ] top bar
- [ ] page container
- [ ] desktop navigation
- [ ] mobile navigation/drawer
- [ ] responsive page layout

### Stage 4 status

**Current:** Not started

---

# Stage 5 — Categories and Products

## 5.1 Category APIs

- [ ] list categories
- [ ] create category
- [ ] edit category
- [ ] validate duplicate category name

## 5.2 Product APIs

- [ ] list products
- [ ] get product
- [ ] create product
- [ ] update product
- [ ] activate/deactivate product

## 5.3 Product Validation

- [ ] SKU required
- [ ] SKU unique per store
- [ ] product name required
- [ ] MRP >= 0
- [ ] buying price >= 0
- [ ] selling price >= 0
- [ ] reorder level >= 0
- [ ] category belongs to same store

## 5.4 Product UI

- [ ] products page
- [ ] search
- [ ] category filter
- [ ] active/inactive filter
- [ ] pagination
- [ ] create product form
- [ ] edit product form
- [ ] desktop table
- [ ] mobile-friendly representation
- [ ] empty state
- [ ] loading state
- [ ] error state

## 5.5 Product Tests

- [ ] validation tests
- [ ] duplicate SKU test
- [ ] cross-store authorization test
- [ ] product API test
- [ ] form test

### Stage 5 status

**Current:** Not started

---

# Stage 6 — Suppliers

## 6.1 Supplier API

- [ ] list suppliers
- [ ] create supplier
- [ ] update supplier
- [ ] get supplier

## 6.2 Supplier UI

- [ ] supplier list
- [ ] supplier search
- [ ] create supplier
- [ ] edit supplier
- [ ] loading/error/empty states

## 6.3 Supplier Tests

- [ ] validation
- [ ] API
- [ ] store isolation

### Stage 6 status

**Current:** Not started

---

# Stage 7 — Purchases and Stock-In

## 7.1 Purchase Form

- [ ] select supplier
- [ ] invoice number
- [ ] purchase date
- [ ] add multiple products
- [ ] quantity
- [ ] buying price
- [ ] MRP snapshot
- [ ] discount
- [ ] tax
- [ ] notes
- [ ] totals

## 7.2 Purchase Service

Single transaction must:

- [ ] create Purchase
- [ ] create PurchaseItem rows
- [ ] create positive InventoryMovement rows
- [ ] update InventoryBalance
- [ ] rollback if any step fails

## 7.3 Purchase API

- [ ] create purchase
- [ ] list purchases
- [ ] purchase detail
- [ ] date filters
- [ ] supplier filter

## 7.4 Purchase UI

- [ ] purchases list
- [ ] create purchase
- [ ] purchase detail
- [ ] filters
- [ ] loading/error/empty states

## 7.5 Purchase Tests

- [ ] total calculation
- [ ] inventory increment
- [ ] multiple line items
- [ ] rollback test
- [ ] unauthorized access
- [ ] cross-store access

### Stage 7 status

**Current:** Not started

---

# Stage 8 — Customers

## 8.1 Customer API

- [ ] list customers
- [ ] create customer
- [ ] edit customer
- [ ] customer detail

## 8.2 Customer Fields

- [ ] name
- [ ] phone
- [ ] address
- [ ] credit limit
- [ ] opening credit
- [ ] active status

## 8.3 Customer UI

- [ ] customer list
- [ ] search
- [ ] create customer
- [ ] edit customer
- [ ] customer detail
- [ ] outstanding credit display

## 8.4 Customer Tests

- [ ] validation
- [ ] API
- [ ] store isolation

### Stage 8 status

**Current:** Not started

---

# Stage 9 — Sales and Stock-Out

## 9.1 Sale Form

- [ ] walk-in sale
- [ ] regular customer sale
- [ ] product selection
- [ ] quantity
- [ ] selling price
- [ ] discount
- [ ] tax
- [ ] payment method
- [ ] amount paid
- [ ] notes
- [ ] totals

## 9.2 Sale Validation

- [ ] product belongs to store
- [ ] quantity > 0
- [ ] selling price >= 0
- [ ] amount paid >= 0
- [ ] amount paid <= total
- [ ] credit requires customer
- [ ] sufficient stock required

## 9.3 Sale Transaction

Single transaction must:

- [ ] verify stock
- [ ] create Sale
- [ ] create SaleItem rows
- [ ] create negative InventoryMovement rows
- [ ] decrement InventoryBalance
- [ ] create CreditLedgerEntry when needed
- [ ] rollback everything on error

## 9.4 Sale UI

- [ ] sales list
- [ ] create sale
- [ ] sale detail
- [ ] paid/credit indicator
- [ ] filters
- [ ] loading/error/empty states

## 9.5 Sale Tests

- [ ] total calculation
- [ ] stock decrement
- [ ] insufficient stock rejection
- [ ] partial payment
- [ ] full credit sale
- [ ] rollback
- [ ] authorization

### Stage 9 status

**Current:** Not started

---

# Stage 10 — Customer Credit

## 10.1 Credit Ledger

- [ ] calculate outstanding balance
- [ ] show credit-sale entries
- [ ] show payments
- [ ] show adjustments

## 10.2 Credit Payment

- [ ] create payment form
- [ ] payment amount
- [ ] payment method
- [ ] reference
- [ ] notes
- [ ] validate amount
- [ ] create negative ledger entry

## 10.3 Credit Rules

- [ ] require customer for credit sale
- [ ] respect credit limit
- [ ] opening credit included
- [ ] payment reduces outstanding
- [ ] historical sales remain unchanged

## 10.4 Credit UI

- [ ] customer credit page
- [ ] current outstanding
- [ ] ledger history
- [ ] payment action
- [ ] date filters

## 10.5 Credit Tests

- [ ] credit sale test
- [ ] repayment test
- [ ] outstanding calculation
- [ ] credit limit test
- [ ] adjustment test

### Stage 10 status

**Current:** Not started

---

# Stage 11 — Inventory

## 11.1 Inventory API

- [ ] current stock
- [ ] low-stock filter
- [ ] out-of-stock filter
- [ ] category filter
- [ ] product search

## 11.2 Inventory UI

Show:

- [ ] product
- [ ] SKU
- [ ] category
- [ ] current quantity
- [ ] reorder level
- [ ] stock status
- [ ] default buying price
- [ ] MRP

## 11.3 Inventory Adjustment

P1 if time permits:

- [ ] adjustment in
- [ ] adjustment out
- [ ] adjustment reason
- [ ] InventoryMovement creation

## 11.4 Inventory Integrity

- [ ] verify purchase increases balance
- [ ] verify sale decreases balance
- [ ] reconciliation query
- [ ] no negative stock

### Stage 11 status

**Current:** Not started

---

# Stage 12 — Reports and Dashboard

## 12.1 Dashboard

- [ ] today's sales
- [ ] today's purchase value
- [ ] outstanding customer credit
- [ ] low-stock count
- [ ] inventory value estimate

## 12.2 Inventory Report

- [ ] current stock
- [ ] low stock
- [ ] out of stock
- [ ] category filter
- [ ] stock value

## 12.3 Sales Report

- [ ] date range
- [ ] total sales
- [ ] payment split
- [ ] credit sales
- [ ] product quantities
- [ ] gross-profit estimate

## 12.4 Purchase Report

- [ ] date range
- [ ] total purchases
- [ ] supplier filter
- [ ] product totals

## 12.5 Credit Report

- [ ] customers with outstanding
- [ ] total outstanding
- [ ] ledger history
- [ ] payments
- [ ] date filters

## 12.6 P1 Reporting

- [ ] CSV export
- [ ] top-selling products
- [ ] print-friendly transaction pages

### Stage 12 status

**Current:** Not started

---

# Stage 13 — Testing and Quality

## 13.1 Jest Setup

- [ ] Jest config
- [ ] jsdom environment
- [ ] React Testing Library setup
- [ ] one sample passing test

## 13.2 Business Logic Tests

- [ ] product validation
- [ ] purchase totals
- [ ] purchase inventory update
- [ ] sale totals
- [ ] sale inventory update
- [ ] stock rejection
- [ ] credit calculation
- [ ] repayment
- [ ] report aggregation

## 13.3 API Tests

- [ ] unauthenticated request
- [ ] forbidden store access
- [ ] validation failures
- [ ] expected business errors

## 13.4 UI Tests

- [ ] product form
- [ ] purchase form
- [ ] sale form
- [ ] customer form
- [ ] credit payment form

### Stage 13 status

**Current:** Not started

---

# Stage 14 — Responsive and UX Hardening

## Desktop

- [ ] sidebar layout
- [ ] table density
- [ ] filters
- [ ] action placement
- [ ] keyboard usability

## Mobile

- [ ] responsive navigation
- [ ] forms stack correctly
- [ ] action bars wrap
- [ ] no accidental page overflow
- [ ] tables remain usable
- [ ] touch targets usable

## Common States

Every major screen must have:

- [ ] loading
- [ ] empty
- [ ] error
- [ ] success feedback where relevant

### Stage 14 status

**Current:** Not started

---

# Stage 15 — CI/CD

## 15.1 GitHub Actions

- [ ] create `.github/workflows/ci.yml`
- [ ] checkout
- [ ] setup Node
- [ ] npm install / npm ci
- [ ] Prisma generate
- [ ] Prisma validate
- [ ] lint
- [ ] typecheck
- [ ] Jest
- [ ] Next.js build

## 15.2 Branch Protection

- [ ] CI required on PR
- [ ] main protected
- [ ] no direct feature commits to main

### Stage 15 status

**Current:** Not started

---

# Stage 16 — Docker

## 16.1 Dockerfile

- [ ] create Dockerfile
- [ ] production build
- [ ] production runtime
- [ ] expose port 3000
- [ ] environment variables externalized
- [ ] non-root runtime user if practical

## 16.2 Local Verification

- [ ] docker build succeeds
- [ ] docker run succeeds
- [ ] app loads
- [ ] database works
- [ ] auth works

### Stage 16 status

**Current:** Not started

---

# Stage 17 — Render Deployment

## 17.1 Render Setup

- [ ] connect GitHub repository
- [ ] create Docker Web Service
- [ ] configure environment variables
- [ ] configure health check
- [ ] deploy

## 17.2 Production Verification

- [ ] login
- [ ] create category
- [ ] create product
- [ ] create supplier
- [ ] record purchase
- [ ] verify stock
- [ ] create customer
- [ ] record credit sale
- [ ] verify stock reduction
- [ ] record repayment
- [ ] verify outstanding credit
- [ ] verify reports
- [ ] verify mobile layout

### Stage 17 status

**Current:** Not started

---

# Stage 18 — Documentation and Phase 1 Closure

- [ ] update README
- [ ] update AGENTS.md if conventions changed
- [ ] update system-design.md
- [ ] document environment variables
- [ ] document local setup
- [ ] document deployment
- [ ] document known limitations
- [ ] record Phase 2 backlog
- [ ] final Phase 1 demo
- [ ] tag/release Phase 1

### Stage 18 status

**Current:** Not started

---

# Phase 1 P0 Completion Checklist

Phase 1 is not complete until all of these are done:

- [ ] authentication works
- [ ] store authorization works
- [ ] category CRUD works
- [ ] product CRUD works
- [ ] supplier CRUD works
- [ ] purchase works
- [ ] purchase increases inventory
- [ ] customer CRUD works
- [ ] sale works
- [ ] sale decreases inventory
- [ ] negative stock is prevented
- [ ] credit sale works
- [ ] repayment works
- [ ] outstanding credit is correct
- [ ] inventory report works
- [ ] sales report works
- [ ] purchase report works
- [ ] credit report works
- [ ] tests pass
- [ ] CI passes
- [ ] Docker build works
- [ ] Render deployment works
- [ ] desktop UI checked
- [ ] mobile UI checked

---

# Deferred to Phase 2

Keep these out of Phase 1 unless explicitly promoted:

- [ ] returns workflow
- [ ] supplier payable ledger
- [ ] GST filing
- [ ] GST invoice compliance improvements
- [ ] barcode scanner hardware
- [ ] batch tracking
- [ ] expiry tracking
- [ ] purchase orders
- [ ] multi-branch support
- [ ] stock transfers
- [ ] WhatsApp/SMS
- [ ] loyalty
- [ ] offline-first support
- [ ] advanced accounting
- [ ] forecasting
- [ ] AI features
