"use client";

import { useState } from "react";
import { CodeEditor } from "@/components/tool-ui/CodeEditor";
import { SplitPane } from "@/components/tool-ui/SplitPane";
import { CopyButton } from "@/components/tool-ui/CopyButton";
import { PasteButton } from "@/components/tool-ui/PasteButton";
import { ClearButton } from "@/components/tool-ui/ClearButton";
import { ErrorDisplay } from "@/components/tool-ui/ErrorDisplay";
import { Button } from "@/components/ui/button";
import { generateCodeAction } from "./actions";

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

interface Props {
  lang: string;
  label: string;
}

export function CodegenTool({ lang, label }: Props) {
  const [input, setInput] = useState("");
  const [typeName, setTypeName] = useState("Root");
  const [output, setOutput] = useState("");
  const [outputKey, setOutputKey] = useState(0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    const r = await generateCodeAction({ input, typeName: typeName.trim() || "Root", lang });
    setLoading(false);
    if (r.success) { setOutput(r.output!); setError(""); setOutputKey((k) => k + 1); }
    else { setOutput(""); setError(r.error!); }
  };

  const resetInput = (val: string) => { setInput(val); setOutput(""); setError(""); };

  return (
    <div className="flex flex-col gap-3 p-4">
      <div className="flex flex-wrap items-center gap-2">
        <Button size="sm" onClick={handleGenerate} disabled={!input.trim() || loading}>
          {loading ? "Generating…" : `JSON → ${label}`}
        </Button>
        <Button size="sm" variant="outline" onClick={() => resetInput(SAMPLE)}>Sample</Button>
        <PasteButton onPaste={resetInput} />
        <ClearButton onClick={() => resetInput("")} />
        <div className="ml-auto flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Type name</span>
          <input
            className="h-7 w-24 rounded-md border border-input bg-background px-2 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-ring"
            value={typeName}
            onChange={(e) => setTypeName(e.target.value)}
          />
        </div>
      </div>
      {error && <ErrorDisplay message={error} />}
      <SplitPane
        left={<CodeEditor value={input} onChange={resetInput} placeholder="Paste JSON here…" height="420px" />}
        right={
          <div className="flex flex-col gap-2 h-full">
            {output ? (
              <><div className="flex justify-end"><CopyButton value={output} /></div><CodeEditor key={outputKey} value={output} readOnly height="390px" /></>
            ) : (
              <div className="flex items-center justify-center rounded-lg border border-border/50 bg-muted/20 text-sm text-muted-foreground" style={{ height: "420px" }}>
                {label} code will appear here
              </div>
            )}
          </div>
        }
      />
    </div>
  );
}
