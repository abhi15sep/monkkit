"use client";

import { useState } from "react";
import { CodeEditor } from "@/components/tool-ui/CodeEditor";
import { SplitPane } from "@/components/tool-ui/SplitPane";
import { CopyButton } from "@/components/tool-ui/CopyButton";
import { PasteButton } from "@/components/tool-ui/PasteButton";
import { ClearButton } from "@/components/tool-ui/ClearButton";
import { ErrorDisplay } from "@/components/tool-ui/ErrorDisplay";
import { Button } from "@/components/ui/button";
import { process } from "./logic";
import type { ToolComponentProps } from "@/types/registry";

export default function JsonMinify({ toolMeta: _ }: ToolComponentProps) {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<ReturnType<typeof process> | null>(null);

  const minify = () => setResult(process({ input }));

  return (
    <div className="flex flex-col gap-4 p-4">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2">
        <Button size="sm" onClick={minify} disabled={!input.trim()}>
          Minify
        </Button>
        <PasteButton onPaste={(t) => { setInput(t); setResult(null); }} />
        <ClearButton onClick={() => { setInput(""); setResult(null); }} />

        {/* Size stats */}
        {result?.success && (
          <div className="ml-auto flex items-center gap-3 text-xs text-muted-foreground">
            <span>Original: <strong className="text-foreground">{result.originalSize} B</strong></span>
            <span>Minified: <strong className="text-foreground">{result.minifiedSize} B</strong></span>
            <span className="text-green-500 font-medium">-{result.savings}%</span>
          </div>
        )}
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
                Minified output will appear here
              </div>
            )}
          </div>
        }
      />
    </div>
  );
}
