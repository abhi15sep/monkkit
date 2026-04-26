import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  message: string | null | undefined;
  className?: string;
}

export function ErrorDisplay({ message, className }: Props) {
  if (!message) return null;
  return (
    <div
      className={cn(
        "flex items-start gap-2 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive",
        className
      )}
    >
      <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
      <span className="break-all">{message}</span>
    </div>
  );
}
