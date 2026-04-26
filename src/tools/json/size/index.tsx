"use client";

import { useState } from "react";
import { CodeEditor } from "@/components/tool-ui/CodeEditor";
import { ErrorDisplay } from "@/components/tool-ui/ErrorDisplay";
import { Button } from "@/components/ui/button";
import { PasteButton } from "@/components/tool-ui/PasteButton";
import { ClearButton } from "@/components/tool-ui/ClearButton";
import { process } from "./logic";
import type { SizeOutput } from "./logic";
import type { ToolComponentProps } from "@/types/registry";

const SAMPLE = `{
  "name": "Alice Johnson",
  "age": 32,
  "email": "alice@example.com",
  "address": {
    "street": "123 Main St",
    "city": "New York",
    "zip": "10001"
  },
  "tags": ["developer", "designer"],
  "active": true,
  "score": 98.5
}`;

function StatCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="flex flex-col gap-0.5 rounded-lg border border-border/50 bg-muted/20 px-4 py-3">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-2xl font-semibold tabular-nums">{value}</span>
      {sub && <span className="text-xs text-muted-foreground">{sub}</span>}
    </div>
  );
}

export default function JsonSize({ toolMeta: _ }: ToolComponentProps) {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<SizeOutput | null>(null);
  const [error, setError] = useState("");

  const handleAnalyze = () => {
    const r = process({ input });
    if (r.success) { setResult(r); setError(""); }
    else { setResult(null); setError(r.error!); }
  };

  const resetInput = (val: string) => { setInput(val); setResult(null); setError(""); };

  const savings = result ? Math.round((1 - result.minifiedSize! / result.byteSize!) * 100) : 0;

  return (
    <div className="flex flex-col gap-3 p-4">
      <div className="flex flex-wrap items-center gap-2">
        <Button size="sm" onClick={handleAnalyze} disabled={!input.trim()}>
          Analyze
        </Button>
        <Button size="sm" variant="outline" onClick={() => resetInput(SAMPLE)}>
          Sample
        </Button>
        <PasteButton onPaste={resetInput} />
        <ClearButton onClick={() => resetInput("")} />
      </div>

      {error && <ErrorDisplay message={error} />}

      {result && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          <StatCard label="Size" value={`${result.byteSize} B`} sub="as-is" />
          <StatCard label="Minified" value={`${result.minifiedSize} B`} sub={`−${savings}% savings`} />
          <StatCard label="Keys" value={result.keyCount!} sub="total object keys" />
          <StatCard label="Values" value={result.valueCount!} sub="leaf values" />
          <StatCard label="Depth" value={result.depth!} sub="max nesting level" />
          <StatCard label="Arrays" value={result.types!.array} sub={`avg len: ${result.arrayLengths!.length ? Math.round(result.arrayLengths!.reduce((a, b) => a + b, 0) / result.arrayLengths!.length) : 0}`} />
        </div>
      )}

      {result && (
        <div className="flex flex-wrap gap-2">
          {Object.entries(result.types!).filter(([, v]) => v > 0).map(([type, count]) => (
            <div key={type} className="flex items-center gap-1.5 rounded-full border border-border/50 bg-muted/30 px-3 py-1 text-xs">
              <span className="text-muted-foreground capitalize">{type}</span>
              <span className="font-semibold">{count}</span>
            </div>
          ))}
        </div>
      )}

      <CodeEditor value={input} onChange={resetInput} placeholder="Paste JSON here…" height="340px" />
    </div>
  );
}
