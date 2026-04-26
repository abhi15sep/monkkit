"use client";

import { useState } from "react";
import { CheckCircle, AlertTriangle, Clock } from "lucide-react";
import { ErrorDisplay } from "@/components/tool-ui/ErrorDisplay";
import { CopyButton } from "@/components/tool-ui/CopyButton";
import { Button } from "@/components/ui/button";
import { process } from "./logic";
import type { JwtDecodeOutput } from "./logic";
import type { ToolComponentProps } from "@/types/registry";

// A real (non-sensitive) example JWT for demo purposes
const SAMPLE = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkFsaWNlIEpvaG5zb24iLCJpYXQiOjE1MTYyMzkwMjIsImV4cCI6OTk5OTk5OTk5OX0.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c`;

function JsonBlock({ label, value, className = "" }: { label: string; value: object; className?: string }) {
  const str = JSON.stringify(value, null, 2);
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{label}</span>
        <CopyButton value={str} />
      </div>
      <pre className="rounded-lg border border-border/50 bg-muted/20 p-3 text-xs font-mono overflow-auto max-h-56 whitespace-pre-wrap break-all">{str}</pre>
    </div>
  );
}

export default function JwtDecode({ toolMeta: _ }: ToolComponentProps) {
  const [token, setToken] = useState("");
  const [result, setResult] = useState<JwtDecodeOutput | null>(null);

  const handleDecode = () => setResult(process({ token }));
  const loadSample = () => { setToken(SAMPLE); setResult(null); };

  return (
    <div className="flex flex-col gap-3 p-4">
      <div className="flex flex-wrap items-center gap-2">
        <Button size="sm" onClick={handleDecode} disabled={!token.trim()}>Decode</Button>
        <Button size="sm" variant="outline" onClick={loadSample}>Sample</Button>
        <Button size="sm" variant="outline" onClick={() => { setToken(""); setResult(null); }}>Clear</Button>
      </div>

      <textarea
        className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm font-mono focus:outline-none focus:ring-1 focus:ring-ring resize-none"
        rows={3}
        value={token}
        onChange={(e) => { setToken(e.target.value); setResult(null); }}
        placeholder="Paste JWT here… eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.…"
        spellCheck={false}
      />

      {result && !result.success && <ErrorDisplay message={result.error!} />}

      {result?.success && (
        <div className="flex flex-col gap-4">
          {/* Status badges */}
          <div className="flex flex-wrap gap-2">
            {result.isExpired !== undefined && (
              <div className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${result.isExpired ? "bg-destructive/15 text-destructive" : "bg-green-500/15 text-green-600 dark:text-green-400"}`}>
                {result.isExpired ? <AlertTriangle className="h-3.5 w-3.5" /> : <CheckCircle className="h-3.5 w-3.5" />}
                {result.isExpired ? "Expired" : "Not expired"}
              </div>
            )}
            {result.expiresAt && (
              <div className="flex items-center gap-1.5 rounded-full border border-border/50 bg-muted/30 px-3 py-1 text-xs text-muted-foreground">
                <Clock className="h-3.5 w-3.5" />
                Expires: {new Date(result.expiresAt).toLocaleString()}
              </div>
            )}
            {result.issuedAt && (
              <div className="flex items-center gap-1.5 rounded-full border border-border/50 bg-muted/30 px-3 py-1 text-xs text-muted-foreground">
                <Clock className="h-3.5 w-3.5" />
                Issued: {new Date(result.issuedAt).toLocaleString()}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <JsonBlock label="Header" value={result.header!} />
            <JsonBlock label="Payload" value={result.payload!} />
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Signature</span>
              <CopyButton value={result.signature!} />
            </div>
            <div className="rounded-lg border border-border/50 bg-muted/20 p-3 text-xs font-mono break-all text-muted-foreground">
              {result.signature}
            </div>
            <p className="text-xs text-muted-foreground">Signature is not verified — this tool only decodes the JWT.</p>
          </div>
        </div>
      )}
    </div>
  );
}
