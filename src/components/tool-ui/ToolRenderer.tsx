"use client";

import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";
import type { ToolDefinition, ToolComponentProps } from "@/types/registry";
import type { ComponentType } from "react";

interface Props {
  toolDef: ToolDefinition;
}

export function ToolRenderer({ toolDef }: Props) {
  const ToolComponent = dynamic(
    toolDef.component as () => Promise<{ default: ComponentType<ToolComponentProps> }>,
    {
      ssr: false,
      loading: () => (
        <div className="space-y-3 p-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-80 w-full" />
        </div>
      ),
    }
  );

  return <ToolComponent toolMeta={toolDef} />;
}
