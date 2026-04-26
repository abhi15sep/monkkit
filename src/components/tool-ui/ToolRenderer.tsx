"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { getToolBySlug } from "@/registry";
import type { ToolComponentProps } from "@/types/registry";
import type { ComponentType } from "react";

interface Props {
  category: string;
  slug: string;
}

export function ToolRenderer({ category, slug }: Props) {
  const toolDef = getToolBySlug(category, slug);

  const ToolComponent = useMemo(() => {
    if (!toolDef) return null;
    return dynamic(
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, slug]);

  if (!toolDef || !ToolComponent) return null;

  return <ToolComponent toolMeta={toolDef} />;
}
