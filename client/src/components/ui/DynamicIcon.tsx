import { HelpCircle, LucideProps, icons } from "lucide-react";

export interface DynamicIconProps extends LucideProps {
  /** PascalCase lucide-react icon name, e.g. "Gamepad2". */
  name: string;
}

/**
 * Resolves a lucide-react icon by its string name (as stored in GameConfig.icon
 * or NavItem.icon). Falls back to HelpCircle if the name doesn't exist, so a
 * bad/unrecognized icon name never crashes the page.
 */
export function DynamicIcon({ name, ...props }: DynamicIconProps) {
  const LucideIcon = icons[name as keyof typeof icons] ?? HelpCircle;
  return <LucideIcon aria-hidden="true" {...props} />;
}
