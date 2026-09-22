import React from "react";

interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
  error?: string;
}

/**
 * Accessible labeled text input, shared across auth (and future) forms.
 * - Large touch target, high-contrast border, visible focus state.
 * - Error text is linked via aria-describedby and announced politely.
 */
export function FormField({ label, id, error, ...inputProps }: FormFieldProps) {
  const errorId = `${id}-error`;

  return (
    <div className="mb-5">
      <label htmlFor={id} className="mb-2 block text-lg font-medium text-gray-900">
        {label}
      </label>
      <input
        id={id}
        {...inputProps}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        className={`w-full rounded-lg border-2 px-4 py-3 text-lg text-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 ${
          error ? "border-red-600" : "border-gray-300"
        }`}
      />
      {error && (
        <p id={errorId} role="alert" className="mt-2 text-base font-medium text-red-700">
          {error}
        </p>
      )}
    </div>
  );
}
