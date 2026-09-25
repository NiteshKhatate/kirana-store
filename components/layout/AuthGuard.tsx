import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/router";

import { useAuth } from "@/features/auth/auth-context";

const publicPages = new Set(["/login", "/health"]);

export function AuthGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { isLoading, session } = useAuth();
  const isPublicPage = publicPages.has(router.pathname);

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (!session && !isPublicPage) {
      void router.replace({
        pathname: "/login",
        query: { next: router.asPath },
      });
      return;
    }

    if (session && router.pathname === "/login") {
      const next = typeof router.query.next === "string" ? router.query.next : "/dashboard";
      void router.replace(next.startsWith("/") ? next : "/dashboard");
    }
  }, [isLoading, isPublicPage, router, session]);

  if (isLoading || (!session && !isPublicPage)) {
    return <p>Loading session…</p>;
  }

  return <>{children}</>;
}
