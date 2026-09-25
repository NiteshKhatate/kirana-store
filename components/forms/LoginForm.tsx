import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useAuth } from "@/features/auth/auth-context";
import { loginSchema, type LoginInput } from "@/schemas/auth";

export function LoginForm() {
  const { signIn } = useAuth();
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) });

  const onSubmit = handleSubmit(async (values) => {
    setServerError(null);
    try {
      await signIn(values);
    } catch (error) {
      setServerError(error instanceof Error ? error.message : "Unable to sign in");
    }
  });

  return (
    <form onSubmit={(event) => void onSubmit(event)} noValidate>
      <div>
        <label htmlFor="email">Email</label>
        <input id="email" type="email" autoComplete="email" {...register("email")} />
        {errors.email && <p role="alert">{errors.email.message}</p>}
      </div>
      <div>
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          {...register("password")}
        />
        {errors.password && <p role="alert">{errors.password.message}</p>}
      </div>
      {serverError && <p role="alert">{serverError}</p>}
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
