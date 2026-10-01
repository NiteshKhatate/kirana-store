# Deployment Runbook

## Render

1. Push the repository to GitHub.
2. Create a Render Blueprint from `render.yaml`, or create a Docker Web Service using `Dockerfile`.
3. Set `DATABASE_URL` and `DIRECT_URL` to the Supabase connection strings.
4. Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.
5. Use `/api/health` as the health check path.
6. Deploy and verify `/api/health`, login, product creation, stock-in, stock-out, credit sale, repayment, and reports.

## GitHub protection

The repository currently uses `master` as its default branch. Protect `master` in GitHub repository settings with these rules:

1. Require a pull request before merging.
2. Require the `validate` status check to pass before merging.
3. Require branches to be up to date before merging.
4. Disable direct pushes and force pushes.
5. Apply the rules to administrators according to the team policy.

If the default branch is later renamed to `main`, apply the same rules to `main`.

## Runtime verification

Docker verification requires a running Docker daemon. The image is configured to expose port 3000, run Next standalone output, receive secrets at runtime, and run as the non-root `nextjs` user.
