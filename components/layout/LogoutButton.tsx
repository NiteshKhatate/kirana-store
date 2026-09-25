import { useState } from "react";

import { useAuth } from "@/features/auth/auth-context";

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
      <button type="button" onClick={() => void handleLogout()} disabled={isSubmitting}>
        {isSubmitting ? "Signing out…" : "Sign out"}
      </button>
      {error && <p role="alert">{error}</p>}
    </div>
  );
}
