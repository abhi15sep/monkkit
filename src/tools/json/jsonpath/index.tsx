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

const SAMPLE_JSON = `{
  "store": {
    "books": [
      { "title": "Clean Code", "author": "Robert Martin", "price": 32.99 },
      { "title": "The Pragmatic Programmer", "author": "Dave Thomas", "price": 41.99 },
      { "title": "Refactoring", "author": "Martin Fowler", "price": 37.50 }
    ],
    "name": "Dev Books"
  }
}`;

const EXAMPLES = [
  { label: "All books", expr: "$.store.books[*]" },
  { label: "All titles", expr: "$.store.books[*].title" },
  { label: "First book", expr: "$.store.books[0]" },
  { label: "All prices", expr: "$.store.books[*].price" },
];

export default function JsonPathTool({ toolMeta: _ }: ToolComponentProps) {
  const [input, setInput] = useState("");
  const [path, setPath] = useState("$.store.books[*].title");
  const [output, setOutput] = useState("");
  const [count, setCount] = useState<number | null>(null);
  const [outputKey, setOutputKey] = useState(0);
  const [error, setError] = useState("");

  const handleQuery = () => {
    const r = process({ input, path });
    if (r.success) {
      setOutput(r.output!);
      setCount(r.count!);
      setError("");
      setOutputKey((k) => k + 1);
    } else {
      setOutput("");
      setCount(null);
      setError(r.error!);
    }
  };

  const resetInput = (val: string) => { setInput(val); setOutput(""); setError(""); setCount(null); };

  return (
    <div className="flex flex-col gap-3 p-4">
      {/* JSONPath expression row */}
      <div className="flex flex-wrap items-center gap-2">
        <input
          className="flex-1 min-w-0 h-8 rounded-md border border-input bg-background px-3 text-sm font-mono focus:outline-none focus:ring-1 focus:ring-ring"
          value={path}
          onChange={(e) => setPath(e.target.value)}
          placeholder="$.store.books[*].title"
          onKeyDown={(e) => e.key === "Enter" && handleQuery()}
        />
        <Button size="sm" onClick={handleQuery} disabled={!input.trim() || !path.trim()}>
          Query
        </Button>
      </div>

      {/* Example expressions */}
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="text-xs text-muted-foreground">Examples:</span>
        {EXAMPLES.map((ex) => (
          <button
            key={ex.expr}
            className="text-xs px-2 py-0.5 rounded border border-border/60 bg-muted/40 hover:bg-muted transition-colors font-mono"
            onClick={() => setPath(ex.expr)}
          >
            {ex.label}
          </button>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-2">
        <Button size="sm" variant="outline" onClick={() => { resetInput(SAMPLE_JSON); setPath("$.store.books[*].title"); }}>
          Sample
        </Button>
        <PasteButton onPaste={resetInput} />
        <ClearButton onClick={() => resetInput("")} />
        {count !== null && (
          <span className="ml-auto text-xs text-muted-foreground">{count} result{count !== 1 ? "s" : ""}</span>
        )}
      </div>

      {error && <ErrorDisplay message={error} />}

      <SplitPane
        left={<CodeEditor value={input} onChange={resetInput} placeholder="Paste JSON here…" height="400px" />}
        right={
          <div className="flex flex-col gap-2 h-full">
            {output ? (
              <>
                <div className="flex justify-end"><CopyButton value={output} /></div>
                <CodeEditor key={outputKey} value={output} readOnly height="370px" />
              </>
            ) : (
              <div className="flex items-center justify-center rounded-lg border border-border/50 bg-muted/20 text-sm text-muted-foreground" style={{ height: "400px" }}>
                Query results will appear here
              </div>
            )}
          </div>
        }
      />
    </div>
  );
}
