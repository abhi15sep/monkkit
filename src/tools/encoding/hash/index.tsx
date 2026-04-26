"use client";

import { useState } from "react";
import { Hash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { PasteButton } from "@/components/tool-ui/PasteButton";
import { ClearButton } from "@/components/tool-ui/ClearButton";
import { CopyButton } from "@/components/tool-ui/CopyButton";
import { ErrorDisplay } from "@/components/tool-ui/ErrorDisplay";
import { process } from "./logic";
import type { ToolComponentProps } from "@/types/registry";
import type { HashAlgo } from "./logic";

const ALL_ALGOS: HashAlgo[] = ["MD5", "SHA-1", "SHA-256", "SHA-384", "SHA-512"];

const SAMPLE = "The quick brown fox jumps over the lazy dog";

export default function HashTool({ toolMeta: _ }: ToolComponentProps) {
  const [input, setInput] = useState("");
  const [hashes, setHashes] = useState<Record<HashAlgo, string> | null>(null);
  const [error, setError] = useState("");
  const [uppercase, setUppercase] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!input.trim()) return;
    setLoading(true);
    const r = await process({ input, algorithms: ALL_ALGOS, uppercase });
    if (r.success) { setHashes(r.hashes!); setError(""); }
    else { setHashes(null); setError(r.error!); }
    setLoading(false);
  };

  const resetInput = (val: string) => { setInput(val); setHashes(null); setError(""); };

  return (
    <div className="flex flex-col gap-4 p-4 max-w-3xl mx-auto">
      <div className="flex flex-col gap-2">
        <Label className="text-sm font-medium">Input text</Label>
        <textarea
          value={input}
          onChange={(e) => { setInput(e.target.value); setHashes(null); setError(""); }}
          placeholder="Enter text to hash..."
          className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm font-mono h-28 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Button size="sm" onClick={handleGenerate} disabled={!input.trim() || loading} className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
          <Hash className="w-4 h-4" />
          Generate Hashes
        </Button>
        <Button size="sm" variant="outline" onClick={() => resetInput(SAMPLE)}>Sample</Button>
        <PasteButton onPaste={resetInput} />
        <ClearButton onClick={() => resetInput("")} />
        <div className="ml-auto flex items-center gap-2">
          <Switch id="uppercase" checked={uppercase} onCheckedChange={setUppercase} />
          <Label htmlFor="uppercase" className="text-sm cursor-pointer">Uppercase</Label>
        </div>
      </div>

      {error && <ErrorDisplay message={error} />}

      {hashes && (
        <div className="flex flex-col gap-3">
          {ALL_ALGOS.map((algo) => (
            <div key={algo} className="rounded-lg border border-border bg-muted/30 p-3">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{algo}</span>
                <CopyButton value={hashes[algo]} />
              </div>
              <code className="text-sm font-mono break-all text-foreground">{hashes[algo]}</code>
            </div>
          ))}
        </div>
      )}

      {!hashes && !error && (
        <div className="rounded-xl border-2 border-dashed border-border p-8 text-center text-muted-foreground">
          <Hash className="w-8 h-8 mx-auto mb-3 opacity-30" />
          <p className="text-sm">Enter text above and click Generate Hashes</p>
          <p className="text-xs mt-1">MD5, SHA-1, SHA-256, SHA-384, SHA-512 — all at once</p>
        </div>
      )}
    </div>
  );
}
