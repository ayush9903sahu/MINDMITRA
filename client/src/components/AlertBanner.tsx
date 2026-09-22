import React from "react";
import { AlertCircle } from "lucide-react";

interface AlertBannerProps {
  message: string;
}

/** Shared banner for form-level errors. Announced immediately to screen readers. */
export function AlertBanner({ message }: AlertBannerProps) {
  return (
    <div
      role="alert"
      className="mb-5 flex items-start gap-3 rounded-lg border-2 border-red-600 bg-red-50 px-4 py-3 text-red-800"
    >
      <AlertCircle className="mt-0.5 h-6 w-6 flex-shrink-0" aria-hidden="true" />
      <p className="text-lg font-medium">{message}</p>
    </div>
  );
}
