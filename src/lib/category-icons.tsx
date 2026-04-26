import { Braces, QrCode, Lock } from "lucide-react";
import type { ComponentType } from "react";

const ICONS: Record<string, ComponentType<{ className?: string }>> = {
  Braces,
  QrCode,
  Lock,
};

export function getCategoryIcon(iconName: string): ComponentType<{ className?: string }> {
  return ICONS[iconName] ?? Braces;
}
