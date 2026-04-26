"use client";

import { useState } from "react";
import { ErrorDisplay } from "@/components/tool-ui/ErrorDisplay";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { PasteButton } from "@/components/tool-ui/PasteButton";
import { ClearButton } from "@/components/tool-ui/ClearButton";
import { process } from "./logic";
import type { TokenCountOutput } from "./logic";
import type { ToolComponentProps } from "@/types/registry";

const SAMPLE = `{
  "messages": [
    { "role": "system", "content": "You are a helpful assistant." },
    { "role": "user", "content": "What is the capital of France?" },
    { "role": "assistant", "content": "The capital of France is Paris." }
  ],
  "model": "gpt-4o",
  "temperature": 0.7,
  "max_tokens": 1024
}`;

const MODELS = ["gpt-4o", "gpt-4", "gpt-3.5-turbo"] as const;

function StatCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="flex flex-col gap-0.5 rounded-lg border border-border/50 bg-muted/20 px-4 py-3">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-2xl font-semibold tabular-nums">{value}</span>
      {sub && <span className="text-xs text-muted-foreground">{sub}</span>}
    </div>
  );
}

export default function JsonTokenCount({ toolMeta: _ }: ToolComponentProps) {
  const [input, setInput] = useState("");
  const [model, setModel] = useState<"gpt-4o" | "gpt-4" | "gpt-3.5-turbo">("gpt-4o");
  const [result, setResult] = useState<TokenCountOutput | null>(null);
  const [error, setError] = useState("");

  const handleCount = () => {
    const r = process({ input, model });
    if (r.success) { setResult(r); setError(""); }
    else { setResult(null); setError(r.error!); }
  };

  const resetInput = (val: string) => { setInput(val); setResult(null); setError(""); };

  // Live count while typing
  const liveCount = input.trim() ? (() => { try { const r = process({ input, model }); return r.tokenCount ?? null; } catch { return null; } })() : null;

  return (
    <div className="flex flex-col gap-3 p-4">
      <div className="flex flex-wrap items-center gap-2">
        <Button size="sm" onClick={handleCount} disabled={!input.trim()}>Count Tokens</Button>
        <Button size="sm" variant="outline" onClick={() => resetInput(SAMPLE)}>Sample</Button>
        <PasteButton onPaste={resetInput} />
        <ClearButton onClick={() => resetInput("")} />
        <div className="ml-auto flex items-center gap-2">
          <Label className="text-xs text-muted-foreground">Model</Label>
          {MODELS.map((m) => (
            <Button key={m} size="sm" variant={model === m ? "default" : "outline"} className="px-2 text-xs" onClick={() => setModel(m)}>{m}</Button>
          ))}
        </div>
      </div>

      {/* Live token counter */}
      {liveCount !== null && !result && (
        <div className="text-xs text-muted-foreground tabular-nums">
          ~{liveCount.toLocaleString()} tokens as you type
        </div>
      )}

      {error && <ErrorDisplay message={error} />}

      {result && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <StatCard label="Tokens" value={result.tokenCount!.toLocaleString()} sub={`${model} (cl100k)`} />
          <StatCard label="Characters" value={result.charCount!.toLocaleString()} sub="UTF-16 code units" />
          <StatCard label="Bytes" value={result.byteCount!.toLocaleString()} sub="UTF-8 encoded" />
          <StatCard label="Chars/Token" value={result.ratio!} sub="avg ratio" />
        </div>
      )}

      <textarea
        className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm font-mono focus:outline-none focus:ring-1 focus:ring-ring resize-none"
        rows={18}
        value={input}
        onChange={(e) => resetInput(e.target.value)}
        placeholder="Paste any text or JSON here to count tokens…"
        spellCheck={false}
      />
    </div>
  );
}
