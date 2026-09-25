import { useState } from "react";
import type { AppProps } from "next/app";
import { QueryClientProvider } from "@tanstack/react-query";

import "@/app/globals.css";
import { AuthGuard } from "@/components/layout/AuthGuard";
import { AuthProvider } from "@/features/auth/auth-context";
import { createQueryClient } from "@/lib/query-client";

export default function App({ Component, pageProps }: AppProps) {
  const [queryClient] = useState(createQueryClient);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AuthGuard>
          <Component {...pageProps} />
        </AuthGuard>
      </AuthProvider>
    </QueryClientProvider>
  );
}
