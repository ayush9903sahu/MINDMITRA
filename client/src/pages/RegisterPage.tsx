import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { ApiError } from "../services/api";
import { FormField } from "../components/FormField";
import { PrimaryButton } from "../components/PrimaryButton";
import { AlertBanner } from "../components/AlertBanner";
import { ROUTES, PASSWORD_MIN_LENGTH } from "../constants";

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    setFieldErrors({});

    if (password !== passwordConfirmation) {
      setFieldErrors({ passwordConfirmation: "Passwords do not match." });
      return;
    }

    setIsSubmitting(true);
    try {
      await register(email, password, passwordConfirmation);
      navigate(ROUTES.DASHBOARD, { replace: true });
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
      <h1 className="mb-2 text-3xl font-bold text-gray-900">Create your account</h1>
      <p className="mb-8 text-lg text-gray-600">
        Set up your BrainCare account to start your cognitive exercises.
      </p>

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
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={fieldErrors.password}
          aria-describedby="password-hint"
          required
        />
        <p id="password-hint" className="-mt-3 mb-5 text-base text-gray-500">
          At least {PASSWORD_MIN_LENGTH} characters, including a letter and a number.
        </p>
        <FormField
          id="passwordConfirmation"
          label="Confirm password"
          type="password"
          autoComplete="new-password"
          value={passwordConfirmation}
          onChange={(e) => setPasswordConfirmation(e.target.value)}
          error={fieldErrors.passwordConfirmation}
          required
        />
        <PrimaryButton type="submit" isLoading={isSubmitting}>
          Create account
        </PrimaryButton>
      </form>

      <p className="mt-6 text-center text-lg text-gray-700">
        Already have an account?{" "}
        <Link to={ROUTES.LOGIN} className="font-semibold text-brand-600 underline">
          Log in
        </Link>
      </p>
    </main>
  );
}
