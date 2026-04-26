"use client";

import { Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useClipboard } from "@/hooks/useClipboard";

interface Props {
  value: string;
  label?: string;
}

export function CopyButton({ value, label = "Copy" }: Props) {
  const { copied, copy } = useClipboard();
  return (
    <Button
      size="sm"
      variant="outline"
      onClick={() => copy(value)}
      disabled={!value}
      className="gap-1.5"
    >
      {copied ? (
        <Check className="h-3.5 w-3.5 text-green-500" />
      ) : (
        <Copy className="h-3.5 w-3.5" />
      )}
      {copied ? "Copied!" : label}
    </Button>
  );
}
