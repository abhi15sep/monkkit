import { Badge } from "@/components/ui/badge";
import { ToolBreadcrumb } from "@/components/layout/ToolBreadcrumb";
import type { ToolMeta } from "@/types/registry";

interface Props {
  meta: ToolMeta;
  children: React.ReactNode;
  actions?: React.ReactNode;
}

const STATUS_VARIANT: Record<
  ToolMeta["status"],
  "default" | "secondary" | "outline"
> = {
  stable: "secondary",
  beta: "outline",
  new: "default",
};

export function ToolShell({ meta, children, actions }: Props) {
  return (
    <div className="flex flex-col gap-4 p-4 lg:p-6 max-w-full">
      <ToolBreadcrumb tool={meta} />

      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold">{meta.name}</h1>
            {meta.status !== "stable" && (
              <Badge variant={STATUS_VARIANT[meta.status]} className="capitalize text-xs">
                {meta.status}
              </Badge>
            )}
          </div>
          <p className="text-muted-foreground mt-1 text-sm max-w-prose">
            {meta.shortDescription}
          </p>
        </div>
        {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
      </div>

      <div className="min-h-0">{children}</div>
    </div>
  );
}
