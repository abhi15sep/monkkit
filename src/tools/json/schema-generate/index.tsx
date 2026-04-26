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
import { process } from "./logic";
import type { ToolComponentProps } from "@/types/registry";

const SAMPLE = `{
  "id": 1,
  "name": "Alice Johnson",
  "email": "alice@example.com",
  "age": 32,
  "address": {
    "street": "123 Main St",
    "city": "New York",
    "zip": "10001"
  },
  "tags": ["developer", "designer"],
  "active": true,
  "score": 98.5
}`;

const DRAFTS = ["draft-07", "2019-09", "2020-12"] as const;

export default function JsonSchemaGenerate({ toolMeta: _ }: ToolComponentProps) {
  const [input, setInput] = useState("");
  const [title, setTitle] = useState("Root");
  const [draft, setDraft] = useState<"draft-07" | "2019-09" | "2020-12">("draft-07");
  const [output, setOutput] = useState("");
  const [outputKey, setOutputKey] = useState(0);
  const [error, setError] = useState("");

  const handleGenerate = () => {
    const r = process({ input, title: title.trim() || "Root", draft });
    if (r.success) { setOutput(r.output!); setError(""); setOutputKey((k) => k + 1); }
    else { setOutput(""); setError(r.error!); }
  };

  const resetInput = (val: string) => { setInput(val); setOutput(""); setError(""); };

  return (
    <div className="flex flex-col gap-3 p-4">
      <div className="flex flex-wrap items-center gap-2">
        <Button size="sm" onClick={handleGenerate} disabled={!input.trim()}>Generate Schema</Button>
        <Button size="sm" variant="outline" onClick={() => resetInput(SAMPLE)}>Sample</Button>
        <PasteButton onPaste={resetInput} />
        <ClearButton onClick={() => resetInput("")} />
        <div className="ml-auto flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Label className="text-xs text-muted-foreground">Title</Label>
            <input
              className="h-7 w-20 rounded-md border border-input bg-background px-2 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-ring"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Label className="text-xs text-muted-foreground">Draft</Label>
            {DRAFTS.map((d) => (
              <Button key={d} size="sm" variant={draft === d ? "default" : "outline"} className="px-2 text-xs" onClick={() => setDraft(d)}>{d}</Button>
            ))}
          </div>
        </div>
      </div>
      {error && <ErrorDisplay message={error} />}
      <SplitPane
        left={<CodeEditor value={input} onChange={resetInput} placeholder="Paste JSON here to infer schema…" height="420px" />}
        right={
          <div className="flex flex-col gap-2 h-full">
            {output ? (
              <><div className="flex justify-end"><CopyButton value={output} /></div><CodeEditor key={outputKey} value={output} readOnly height="390px" /></>
            ) : (
              <div className="flex items-center justify-center rounded-lg border border-border/50 bg-muted/20 text-sm text-muted-foreground" style={{ height: "420px" }}>JSON Schema will appear here</div>
            )}
          </div>
        }
      />
    </div>
  );
}
