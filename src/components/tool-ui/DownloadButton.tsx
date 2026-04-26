"use client";

import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  content: string;
  filename: string;
  mimeType?: string;
  label?: string;
}

export function DownloadButton({
  content,
  filename,
  mimeType = "text/plain",
  label = "Download",
}: Props) {
  const handleDownload = () => {
    if (!content) return;
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Button
      size="sm"
      variant="outline"
      onClick={handleDownload}
      disabled={!content}
      className="gap-1.5"
    >
      <Download className="h-3.5 w-3.5" />
      {label}
    </Button>
  );
}
