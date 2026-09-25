import Head from "next/head";

import { LoginForm } from "@/components/forms/LoginForm";
import { Card } from "@/components/ui/Card";

export default function LoginPage() {
  return (
    <>
      <Head>
        <title>Sign in | Kirana Store Manager</title>
      </Head>
      <main className="flex min-h-screen items-center justify-center bg-page px-4 py-8">
        <Card className="w-full max-w-md p-6 sm:p-8">
          <div className="mb-6">
            <p className="text-sm font-bold text-brand-600">Kirana Store Manager</p>
            <h1 className="mt-2 text-2xl font-bold text-content">Welcome back</h1>
            <p className="mt-1 text-sm text-content-muted">Sign in to manage your store workspace.</p>
          </div>
          <LoginForm />
        </Card>
      </main>
    </>
  );
}
