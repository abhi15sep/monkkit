"use client";

// The formatter logic is exposed via API at /api/v1/json/formatter.
// The web UI uses the unified JSON tool (validator page) which has Format + Minify + Validate in one window.
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import type { ToolComponentProps } from "@/types/registry";

export default function JsonFormatterRedirect({ toolMeta: _ }: ToolComponentProps) {
  const router = useRouter();
  useEffect(() => {
    router.replace("/tools/json/validator");
  }, [router]);

  return (
    <div className="space-y-3 p-4">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-80 w-full" />
    </div>
  );
}
