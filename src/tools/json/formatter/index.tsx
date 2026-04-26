"use client";

import { useState } from "react";
import { CodeEditor } from "@/components/tool-ui/CodeEditor";
import { SplitPane } from "@/components/tool-ui/SplitPane";
import { CopyButton } from "@/components/tool-ui/CopyButton";
import { PasteButton } from "@/components/tool-ui/PasteButton";
import { ClearButton } from "@/components/tool-ui/ClearButton";
import { ErrorDisplay } from "@/components/tool-ui/ErrorDisplay";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { process } from "./logic";
import type { ToolComponentProps } from "@/types/registry";

const INDENT_OPTIONS = [2, 4] as const;

export default function JsonFormatter({ toolMeta: _ }: ToolComponentProps) {
  const [input, setInput] = useState("");
  const [indent, setIndent] = useState<2 | 4>(2);
  const [sortKeys, setSortKeys] = useState(false);
  const [result, setResult] = useState<ReturnType<typeof process> | null>(null);

  const format = () => setResult(process({ input, indent, sortKeys }));

  return (
    <div className="flex flex-col gap-4 p-4">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        <Button size="sm" onClick={format} disabled={!input.trim()}>
          Format
        </Button>
        <PasteButton onPaste={(t) => { setInput(t); setResult(null); }} />
        <ClearButton onClick={() => { setInput(""); setResult(null); }} />
        <div className="ml-auto flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Switch
              id="sort-keys"
              checked={sortKeys}
              onCheckedChange={(v) => { setSortKeys(v); setResult(null); }}
            />
            <Label htmlFor="sort-keys" className="text-xs text-muted-foreground cursor-pointer">
              Sort keys
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <Label className="text-xs text-muted-foreground">Indent</Label>
            {INDENT_OPTIONS.map((n) => (
              <Button
                key={n}
                size="sm"
                variant={indent === n ? "default" : "outline"}
                className="w-8 px-0"
                onClick={() => setIndent(n)}
              >
                {n}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <SplitPane
        left={
          <CodeEditor
            value={input}
            onChange={(v) => { setInput(v); setResult(null); }}
            placeholder='Paste JSON here…'
          />
        }
        right={
          <div className="flex flex-col gap-2 h-full">
            {result?.error && <ErrorDisplay message={result.error} />}
            {result?.output && (
              <>
                <div className="flex justify-end">
                  <CopyButton value={result.output} />
                </div>
                <CodeEditor value={result.output} readOnly />
              </>
            )}
            {!result && (
              <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
                Formatted output will appear here
              </div>
            )}
          </div>
        }
      />
    </div>
  );
}
