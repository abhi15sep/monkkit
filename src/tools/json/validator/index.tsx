"use client";

import { useState } from "react";
import { CheckCircle, XCircle } from "lucide-react";
import { CodeEditor } from "@/components/tool-ui/CodeEditor";
import { SplitPane } from "@/components/tool-ui/SplitPane";
import { CopyButton } from "@/components/tool-ui/CopyButton";
import { PasteButton } from "@/components/tool-ui/PasteButton";
import { ClearButton } from "@/components/tool-ui/ClearButton";
import { ErrorDisplay } from "@/components/tool-ui/ErrorDisplay";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { process } from "./logic";
import type { ToolComponentProps } from "@/types/registry";

const INDENT_OPTIONS = [2, 4] as const;

export default function JsonValidator({ toolMeta: _ }: ToolComponentProps) {
  const [input, setInput] = useState("");
  const [indent, setIndent] = useState<2 | 4>(2);
  const [result, setResult] = useState<ReturnType<typeof process> | null>(null);

  const validate = () => setResult(process({ input, indent }));

  return (
    <div className="flex flex-col gap-4 p-4">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2">
        <Button size="sm" onClick={validate} disabled={!input.trim()}>
          Validate
        </Button>
        <PasteButton onPaste={(t) => { setInput(t); setResult(null); }} />
        <ClearButton onClick={() => { setInput(""); setResult(null); }} />
        <div className="ml-auto flex items-center gap-2">
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

      {/* Status badge */}
      {result && (
        <div className={`flex items-center gap-2 text-sm font-medium ${result.valid ? "text-green-500" : "text-destructive"}`}>
          {result.valid
            ? <><CheckCircle className="h-4 w-4" /> Valid JSON</>
            : <><XCircle className="h-4 w-4" /> Invalid JSON{result.error?.line ? ` — line ${result.error.line}, col ${result.error.column}` : ""}</>
          }
        </div>
      )}

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
            {result?.error && <ErrorDisplay message={result.error.message} />}
            {result?.formatted && (
              <>
                <div className="flex justify-end">
                  <CopyButton value={result.formatted} />
                </div>
                <CodeEditor value={result.formatted} readOnly />
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
