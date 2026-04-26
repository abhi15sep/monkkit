"use client";

import { Group, Panel, Separator } from "react-resizable-panels";

interface Props {
  left: React.ReactNode;
  right: React.ReactNode;
  leftLabel?: string;
  rightLabel?: string;
  defaultSize?: number;
}

export function SplitPane({
  left,
  right,
  leftLabel = "Input",
  rightLabel = "Output",
  defaultSize = 50,
}: Props) {
  return (
    <Group orientation="horizontal" className="gap-0">
      <Panel defaultSize={defaultSize} minSize={25}>
        <div className="flex flex-col h-full gap-2">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            {leftLabel}
          </span>
          {left}
        </div>
      </Panel>

      <Separator className="w-1.5 mx-1 rounded-full bg-border/50 hover:bg-primary/50 transition-colors cursor-col-resize" />

      <Panel defaultSize={100 - defaultSize} minSize={25}>
        <div className="flex flex-col h-full gap-2">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            {rightLabel}
          </span>
          {right}
        </div>
      </Panel>
    </Group>
  );
}
