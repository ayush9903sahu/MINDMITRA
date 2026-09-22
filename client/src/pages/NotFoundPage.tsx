import { Link } from "react-router-dom";
import { Button } from "@/components/ui";
import { ROUTES } from "@shared/constants/routes";

export function NotFoundPage() {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center gap-4 py-16 text-center">
      <h1 className="text-3xl font-semibold text-neutral-900">Page not found</h1>
      <p className="text-base text-neutral-600">The page you&apos;re looking for doesn&apos;t exist.</p>
      <Link to={ROUTES.DASHBOARD}>
        <Button>Go to Dashboard</Button>
      </Link>
    </div>
  );
}
