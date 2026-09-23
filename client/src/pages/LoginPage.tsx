import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { ApiError } from "../services/api";
import { FormField } from "../components/FormField";
import { PrimaryButton } from "../components/PrimaryButton";
import { AlertBanner } from "../components/AlertBanner";
import { ROUTES } from "../constants";

interface LocationState {
  from?: { pathname: string };
}

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    setFieldErrors({});
    setIsSubmitting(true);

    try {
      await login(email, password);
      const state = location.state as LocationState | null;
      const redirectTo = state?.from?.pathname || ROUTES.DASHBOARD;
      navigate(redirectTo, { replace: true });
    } catch (err) {
      if (err instanceof ApiError) {
        setFormError(err.message);
        if (err.fields) setFieldErrors(err.fields);
      } else {
        setFormError("Something went wrong. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6 py-12">
      <h1 className="mb-2 text-3xl font-bold text-gray-900">Welcome back</h1>
      <p className="mb-8 text-lg text-gray-600">Log in to continue your cognitive exercises.</p>

      {formError && <AlertBanner message={formError} />}

      <form onSubmit={handleSubmit} noValidate>
        <FormField
          id="email"
          label="Email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={fieldErrors.email}
          required
        />
        <FormField
          id="password"
          label="Password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={fieldErrors.password}
          required
        />
        <PrimaryButton type="submit" isLoading={isSubmitting}>
          Log in
        </PrimaryButton>
      </form>

      <p className="mt-6 text-center text-lg text-gray-700">
        Don&apos;t have an account?{" "}
        <Link to={ROUTES.REGISTER} className="font-semibold text-brand-600 underline">
          Create one
        </Link>
      </p>
    </main>
  );
}
