import Head from "next/head";

import { LoginForm } from "@/components/forms/LoginForm";

export default function LoginPage() {
  return (
    <>
      <Head>
        <title>Sign in | Kirana Store Manager</title>
      </Head>
      <main>
        <h1>Sign in</h1>
        <p>Access your store workspace.</p>
        <LoginForm />
      </main>
    </>
  );
}
