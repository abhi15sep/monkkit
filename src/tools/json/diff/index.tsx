"use client";

import { useState } from "react";
import { CodeEditor } from "@/components/tool-ui/CodeEditor";
import { ErrorDisplay } from "@/components/tool-ui/ErrorDisplay";
import { Button } from "@/components/ui/button";
import { ClearButton } from "@/components/tool-ui/ClearButton";
import { process } from "./logic";
import type { DiffLine } from "./logic";
import type { ToolComponentProps } from "@/types/registry";

const SAMPLE_LEFT = `{
  "name": "Alice Johnson",
  "age": 32,
  "email": "alice@example.com",
  "role": "admin",
  "active": true
}`;

const SAMPLE_RIGHT = `{
  "name": "Alice Smith",
  "age": 33,
  "email": "alice@example.com",
  "department": "engineering",
  "active": false
}`;

function DiffRow({ line }: { line: DiffLine }) {
  const colors: Record<string, string> = {
    added: "bg-green-500/10 text-green-700 dark:text-green-400",
    removed: "bg-red-500/10 text-red-700 dark:text-red-400",
    changed: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400",
    unchanged: "text-muted-foreground",
  };
  const prefix = { added: "+ ", removed: "- ", changed: "~ ", unchanged: "  " };

  return (
    <div className={`flex gap-3 px-3 py-1 text-xs font-mono rounded ${colors[line.type]}`}>
      <span className="w-4 shrink-0 select-none">{prefix[line.type]}</span>
      <span className="shrink-0 text-muted-foreground min-w-[140px] truncate">{line.path}</span>
      {line.type === "changed" ? (
        <span>
          <span className="line-through opacity-60">{JSON.stringify(line.leftValue)}</span>
          {" → "}
          <span>{JSON.stringify(line.rightValue)}</span>
        </span>
      ) : (
        <span>{JSON.stringify(line.type === "removed" ? line.leftValue : line.rightValue ?? line.leftValue)}</span>
      )}
    </div>
  );
}

export default function JsonDiff({ toolMeta: _ }: ToolComponentProps) {
  const [left, setLeft] = useState("");
  const [right, setRight] = useState("");
  const [result, setResult] = useState<ReturnType<typeof process> | null>(null);
  const [showUnchanged, setShowUnchanged] = useState(false);

  const handleDiff = () => setResult(process({ left, right }));

  const loadSample = () => { setLeft(SAMPLE_LEFT); setRight(SAMPLE_RIGHT); setResult(null); };
  const handleClear = () => { setLeft(""); setRight(""); setResult(null); };

  const lines = result?.lines?.filter((l) => showUnchanged || l.type !== "unchanged") ?? [];

  return (
    <div className="flex flex-col gap-3 p-4">
      <div className="flex flex-wrap items-center gap-2">
        <Button size="sm" onClick={handleDiff} disabled={!left.trim() || !right.trim()}>
          Compare
        </Button>
        <Button size="sm" variant="outline" onClick={loadSample}>
          Sample
        </Button>
        <ClearButton onClick={handleClear} />
        {result?.success && (
          <div className="ml-auto flex items-center gap-3 text-xs">
            <span className="text-green-600 dark:text-green-400">+{result.addedCount} added</span>
            <span className="text-red-600 dark:text-red-400">−{result.removedCount} removed</span>
            <span className="text-yellow-600 dark:text-yellow-400">~{result.changedCount} changed</span>
            <button
              className="text-muted-foreground underline underline-offset-2"
              onClick={() => setShowUnchanged((v) => !v)}
            >
              {showUnchanged ? "Hide unchanged" : "Show unchanged"}
            </button>
          </div>
        )}
      </div>

      {result?.error && <ErrorDisplay message={result.error} />}

      {/* Two input panes */}
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1">
          <span className="text-xs text-muted-foreground font-medium px-1">Left (original)</span>
          <CodeEditor value={left} onChange={(v) => { setLeft(v); setResult(null); }} placeholder="Paste JSON…" height="300px" />
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-xs text-muted-foreground font-medium px-1">Right (modified)</span>
          <CodeEditor value={right} onChange={(v) => { setRight(v); setResult(null); }} placeholder="Paste JSON…" height="300px" />
        </div>
      </div>

      {/* Diff output */}
      {result?.success && (
        <div className="flex flex-col gap-0.5 rounded-lg border border-border/50 bg-muted/10 p-2 max-h-72 overflow-y-auto">
          {lines.length === 0 ? (
            <p className="text-xs text-muted-foreground text-center py-4">No differences found — JSONs are identical</p>
          ) : (
            lines.map((line, i) => <DiffRow key={i} line={line} />)
          )}
        </div>
      )}
    </div>
  );
}
