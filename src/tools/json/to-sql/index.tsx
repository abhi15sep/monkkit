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

const DIALECTS = ["postgres", "mysql", "sqlite"] as const;

export default function JsonToSql({ toolMeta: _ }: ToolComponentProps) {
  const [input, setInput] = useState("");
  const [tableName, setTableName] = useState("my_table");
  const [dialect, setDialect] = useState<"postgres" | "mysql" | "sqlite">("postgres");
  const [output, setOutput] = useState("");
  const [outputKey, setOutputKey] = useState(0);
  const [rowCount, setRowCount] = useState<number | null>(null);
  const [error, setError] = useState("");

  const handleConvert = () => {
    const r = process({ input, tableName: tableName.trim() || "my_table", dialect });
    if (r.success) { setOutput(r.output!); setRowCount(r.rowCount!); setError(""); setOutputKey((k) => k + 1); }
    else { setOutput(""); setRowCount(null); setError(r.error!); }
  };

  const resetInput = (val: string) => { setInput(val); setOutput(""); setRowCount(null); setError(""); };

  return (
    <div className="flex flex-col gap-3 p-4">
      <div className="flex flex-wrap items-center gap-2">
        <Button size="sm" onClick={handleConvert} disabled={!input.trim()}>JSON → SQL</Button>
        <Button size="sm" variant="outline" onClick={() => resetInput(SAMPLE)}>Sample</Button>
        <PasteButton onPaste={resetInput} />
        <ClearButton onClick={() => resetInput("")} />
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <Label className="text-xs text-muted-foreground">Table</Label>
          <input
            className="h-7 w-28 rounded-md border border-input bg-background px-2 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-ring"
            value={tableName}
            onChange={(e) => setTableName(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Label className="text-xs text-muted-foreground">Dialect</Label>
          {DIALECTS.map((d) => (
            <Button key={d} size="sm" variant={dialect === d ? "default" : "outline"} className="px-2 capitalize" onClick={() => setDialect(d)}>{d}</Button>
          ))}
        </div>
        {rowCount !== null && <span className="ml-auto text-xs text-muted-foreground">{rowCount} INSERT{rowCount !== 1 ? "s" : ""}</span>}
      </div>
      {error && <ErrorDisplay message={error} />}
      <SplitPane
        left={<CodeEditor value={input} onChange={resetInput} placeholder="Paste JSON array of objects…" height="400px" />}
        right={
          <div className="flex flex-col gap-2 h-full">
            {output ? (
              <><div className="flex justify-end"><CopyButton value={output} /></div><CodeEditor key={outputKey} value={output} readOnly height="370px" /></>
            ) : (
              <div className="flex items-center justify-center rounded-lg border border-border/50 bg-muted/20 text-sm text-muted-foreground" style={{ height: "400px" }}>SQL INSERT statements will appear here</div>
            )}
          </div>
        }
      />
    </div>
  );
}
