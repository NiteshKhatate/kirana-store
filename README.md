# Kirana Store Manager

Phase 1 store operations app built with Next.js Pages Router, Prisma, Supabase Postgres/Auth, React Query, Zod, and Tailwind CSS.

## Database setup

Set `DATABASE_URL` to the PostgreSQL connection string from Supabase's **Connect** dialog. For the pooler, use the exact region-specific host supplied there (for example, `aws-0-ap-south-1.pooler.supabase.com`); do not leave `aws-X-REGION.pooler.supabase.com` in the value. The app also recognizes that placeholder and falls back to the project's direct Supabase database host for local development.

## Getting Started

Install Node.js 20+, copy `.env.example` to `.env`, provide the Supabase values, then run `npm ci`. For an existing Supabase schema, use `npx prisma db pull` followed by `npx prisma generate`.

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

Required environment variables are `DATABASE_URL`, `DIRECT_URL`, `NEXT_PUBLIC_SUPABASE_URL`, and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`. Never commit `.env` or Supabase secret keys.

## Quality checks

```bash
npm run lint
npx tsc --noEmit
npm test -- --runInBand
npm run build
```

## Docker and Render

The production image uses Next.js standalone output, binds to `0.0.0.0`, uses Render's `$PORT` (default 10000), and runs as a non-root user locally on port 3000:

```bash
docker build --build-arg NEXT_PUBLIC_SUPABASE_URL=... --build-arg NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=... -t kirana-store .
docker run --rm -e PORT=3000 -p 3000:3000 --env-file .env kirana-store
```

Render can deploy the repository using `render.yaml`. Configure the environment variables in Render, use `/api/health` as the health check, and verify login plus the Phase 1 smoke flow after deployment.

## Known Phase 1 limitations

Returns, supplier payable ledgers, GST filing, batch/expiry tracking, purchase orders, transfers, messaging, loyalty, offline mode, advanced accounting, forecasting, and AI features remain deferred to Phase 2.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
