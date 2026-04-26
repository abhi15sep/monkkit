"use client";

import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  onClick: () => void;
  label?: string;
}

export function ClearButton({ onClick, label = "Clear" }: Props) {
  return (
    <Button size="sm" variant="ghost" onClick={onClick} className="gap-1.5">
      <X className="h-3.5 w-3.5" />
      {label}
    </Button>
  );
}
