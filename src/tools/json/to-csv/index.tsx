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

const SAMPLE = `[
  { "id": 1, "name": "Alice Johnson", "role": "admin", "active": true },
  { "id": 2, "name": "Bob Smith", "role": "developer", "active": true },
  { "id": 3, "name": "Carol White", "role": "designer", "active": false }
]`;

export default function JsonToCsv({ toolMeta: _ }: ToolComponentProps) {
  const [input, setInput] = useState("");
  const [delimiter, setDelimiter] = useState(",");
  const [output, setOutput] = useState("");
  const [outputKey, setOutputKey] = useState(0);
  const [rowCount, setRowCount] = useState<number | null>(null);
  const [error, setError] = useState("");

  const handleConvert = () => {
    const r = process({ input, delimiter });
    if (r.success) { setOutput(r.output!); setRowCount(r.rowCount!); setError(""); setOutputKey((k) => k + 1); }
    else { setOutput(""); setRowCount(null); setError(r.error!); }
  };

  const resetInput = (val: string) => { setInput(val); setOutput(""); setRowCount(null); setError(""); };

  return (
    <div className="flex flex-col gap-3 p-4">
      <div className="flex flex-wrap items-center gap-2">
        <Button size="sm" onClick={handleConvert} disabled={!input.trim()}>JSON → CSV</Button>
        <Button size="sm" variant="outline" onClick={() => resetInput(SAMPLE)}>Sample</Button>
        <PasteButton onPaste={resetInput} />
        <ClearButton onClick={() => resetInput("")} />
        <div className="ml-auto flex items-center gap-2">
          <Label className="text-xs text-muted-foreground">Delimiter</Label>
          {[",", ";", "\t"].map((d) => (
            <Button key={d} size="sm" variant={delimiter === d ? "default" : "outline"} className="w-10 px-0 font-mono text-xs" onClick={() => setDelimiter(d)}>
              {d === "\t" ? "TAB" : d}
            </Button>
          ))}
        </div>
        {rowCount !== null && <span className="text-xs text-muted-foreground">{rowCount} rows</span>}
      </div>
      {error && <ErrorDisplay message={error} />}
      <SplitPane
        left={<CodeEditor value={input} onChange={resetInput} placeholder="Paste JSON array of objects…" height="420px" />}
        right={
          <div className="flex flex-col gap-2 h-full">
            {output ? (
              <><div className="flex justify-end"><CopyButton value={output} /></div><CodeEditor key={outputKey} value={output} readOnly height="390px" /></>
            ) : (
              <div className="flex items-center justify-center rounded-lg border border-border/50 bg-muted/20 text-sm text-muted-foreground" style={{ height: "420px" }}>CSV output will appear here</div>
            )}
          </div>
        }
      />
    </div>
  );
}
