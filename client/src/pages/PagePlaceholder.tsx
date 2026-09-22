import { ReactNode } from "react";
import { Card } from "@/components/ui";

export interface PagePlaceholderProps {
  title: string;
  ownerModule: string;
  children?: ReactNode;
}

/**
 * Simple placeholder used by every route page until its owning module
 * replaces it. Not exported for reuse outside pages/ — each page composes it
 * directly so it's obvious where to swap in real content later.
 */
export function PagePlaceholder({ title, ownerModule, children }: PagePlaceholderProps) {
  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-4">
      <h1 className="text-2xl font-semibold text-neutral-900 md:text-3xl">{title}</h1>
      <Card>
        <p className="text-base text-neutral-700">
          This page is a placeholder from the Foundation module. It will be replaced by the{" "}
          <span className="font-medium">{ownerModule}</span> module.
        </p>
        {children}
      </Card>
    </div>
  );
}
