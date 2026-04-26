"use client";

import { ClipboardPaste } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  onPaste: (text: string) => void;
  label?: string;
}

export function PasteButton({ onPaste, label = "Paste" }: Props) {
  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      onPaste(text);
    } catch {
      // permission denied or no clipboard content
    }
  };

  return (
    <Button size="sm" variant="ghost" onClick={handlePaste} className="gap-1.5">
      <ClipboardPaste className="h-3.5 w-3.5" />
      {label}
    </Button>
  );
}
