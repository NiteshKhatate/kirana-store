import { useState } from "react";

import { useAuth } from "@/features/auth/auth-context";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";

export function LogoutButton() {
  const { signOut } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleLogout() {
    setIsSubmitting(true);
    setError(null);

    try {
      await signOut();
    } catch (logoutError) {
      setError(logoutError instanceof Error ? logoutError.message : "Unable to sign out");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div>
      <Button type="button" variant="secondary" size="sm" onClick={() => void handleLogout()} disabled={isSubmitting}>
        {isSubmitting ? "Signing out…" : "Sign out"}
      </Button>
      {error && <div className="mt-2"><Alert tone="danger">{error}</Alert></div>}
    </div>
  );
}
