"use client";

import { useState } from "react";
import { CodeEditor } from "@/components/tool-ui/CodeEditor";
import { ErrorDisplay } from "@/components/tool-ui/ErrorDisplay";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { PasteButton } from "@/components/tool-ui/PasteButton";
import { ClearButton } from "@/components/tool-ui/ClearButton";
import { process } from "./logic";
import type { SearchMatch } from "./logic";
import type { ToolComponentProps } from "@/types/registry";

const SAMPLE = `{
  "users": [
    { "id": 1, "name": "Alice Johnson", "role": "admin", "email": "alice@example.com" },
    { "id": 2, "name": "Bob Smith", "role": "developer", "email": "bob@example.com" },
    { "id": 3, "name": "Carol Admin", "role": "admin", "email": "carol@example.com" }
  ],
  "config": {
    "admin_email": "ops@example.com",
    "max_users": 100
  }
}`;

function MatchRow({ match }: { match: SearchMatch }) {
  return (
    <div className="flex items-start gap-3 px-3 py-2 text-xs font-mono border-b border-border/30 last:border-0">
      <span className={`shrink-0 rounded px-1.5 py-0.5 text-[10px] font-sans font-medium ${match.matchedOn === "key" ? "bg-blue-500/15 text-blue-600 dark:text-blue-400" : "bg-purple-500/15 text-purple-600 dark:text-purple-400"}`}>
        {match.matchedOn}
      </span>
      <span className="text-muted-foreground shrink-0 min-w-[160px] truncate">{match.path || match.key}</span>
      <span className="truncate">{JSON.stringify(match.value)}</span>
    </div>
  );
}

export default function JsonSearch({ toolMeta: _ }: ToolComponentProps) {
  const [input, setInput] = useState("");
  const [query, setQuery] = useState("");
  const [searchIn, setSearchIn] = useState<"keys" | "values" | "both">("both");
  const [matches, setMatches] = useState<SearchMatch[] | null>(null);
  const [count, setCount] = useState<number | null>(null);
  const [error, setError] = useState("");

  const handleSearch = () => {
    const r = process({ input, query, searchIn });
    if (r.success) { setMatches(r.matches!); setCount(r.count!); setError(""); }
    else { setMatches(null); setCount(null); setError(r.error!); }
  };

  const resetInput = (val: string) => { setInput(val); setMatches(null); setCount(null); setError(""); };

  return (
    <div className="flex flex-col gap-3 p-4">
      {/* Search row */}
      <div className="flex flex-wrap items-center gap-2">
        <input
          className="flex-1 min-w-0 h-8 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for a key or value…"
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        <Button size="sm" onClick={handleSearch} disabled={!input.trim() || !query.trim()}>
          Search
        </Button>
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2">
        <Button size="sm" variant="outline" onClick={() => { resetInput(SAMPLE); setQuery("admin"); }}>
          Sample
        </Button>
        <PasteButton onPaste={resetInput} />
        <ClearButton onClick={() => { resetInput(""); setQuery(""); }} />
        <div className="ml-auto flex items-center gap-2">
          <Label className="text-xs text-muted-foreground">Search in</Label>
          {(["both", "keys", "values"] as const).map((opt) => (
            <Button key={opt} size="sm" variant={searchIn === opt ? "default" : "outline"} className="px-2 capitalize" onClick={() => setSearchIn(opt)}>
              {opt}
            </Button>
          ))}
        </div>
      </div>

      {error && <ErrorDisplay message={error} />}

      <CodeEditor value={input} onChange={resetInput} placeholder="Paste JSON here…" height="260px" />

      {matches !== null && (
        <div className="flex flex-col rounded-lg border border-border/50 bg-muted/10 overflow-hidden">
          <div className="flex items-center justify-between px-3 py-2 border-b border-border/50 bg-muted/20">
            <span className="text-xs font-medium">{count} match{count !== 1 ? "es" : ""}</span>
            {count === 0 && <span className="text-xs text-muted-foreground">No results for &quot;{query}&quot;</span>}
          </div>
          <div className="max-h-52 overflow-y-auto">
            {matches.map((m, i) => <MatchRow key={i} match={m} />)}
          </div>
        </div>
      )}
    </div>
  );
}
