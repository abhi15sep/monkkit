"use client";

import { useState } from "react";
import { CheckCircle, XCircle } from "lucide-react";
import { CodeEditor } from "@/components/tool-ui/CodeEditor";
import { ErrorDisplay } from "@/components/tool-ui/ErrorDisplay";
import { Button } from "@/components/ui/button";
import { ClearButton } from "@/components/tool-ui/ClearButton";
import { process } from "./logic";
import type { ValidationError } from "./logic";
import type { ToolComponentProps } from "@/types/registry";

const SAMPLE_DATA = `{
  "name": "Alice Johnson",
  "age": 32,
  "email": "alice@example.com",
  "active": true
}`;

const SAMPLE_SCHEMA = `{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "required": ["name", "age", "email"],
  "properties": {
    "name": { "type": "string", "minLength": 1 },
    "age": { "type": "integer", "minimum": 0, "maximum": 120 },
    "email": { "type": "string", "format": "email" },
    "active": { "type": "boolean" }
  },
  "additionalProperties": false
}`;

export default function JsonSchemaValidate({ toolMeta: _ }: ToolComponentProps) {
  const [data, setData] = useState("");
  const [schema, setSchema] = useState("");
  const [result, setResult] = useState<ReturnType<typeof process> | null>(null);

  const handleValidate = () => setResult(process({ data, schema }));
  const loadSample = () => { setData(SAMPLE_DATA); setSchema(SAMPLE_SCHEMA); setResult(null); };
  const handleClear = () => { setData(""); setSchema(""); setResult(null); };

  return (
    <div className="flex flex-col gap-3 p-4">
      <div className="flex flex-wrap items-center gap-2">
        <Button size="sm" onClick={handleValidate} disabled={!data.trim() || !schema.trim()}>
          Validate
        </Button>
        <Button size="sm" variant="outline" onClick={loadSample}>Sample</Button>
        <ClearButton onClick={handleClear} />
      </div>

      {result && !result.success && <ErrorDisplay message={result.error!} />}

      {result?.success && (
        <div className={`flex items-center gap-2 text-sm font-medium ${result.valid ? "text-green-500" : "text-destructive"}`}>
          {result.valid ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
          <span>{result.valid ? "Valid — data matches the schema" : `Invalid — ${result.errorCount} error${result.errorCount !== 1 ? "s" : ""}`}</span>
        </div>
      )}

      {result?.errors && result.errors.length > 0 && (
        <div className="flex flex-col gap-1 rounded-lg border border-destructive/30 bg-destructive/5 p-3">
          {result.errors.map((e: ValidationError, i: number) => (
            <div key={i} className="flex items-start gap-2 text-xs">
              <span className="shrink-0 rounded px-1.5 py-0.5 bg-destructive/15 text-destructive font-mono">{e.path}</span>
              <span className="text-muted-foreground">{e.message}</span>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1">
          <span className="text-xs font-medium text-muted-foreground px-1">JSON Data</span>
          <CodeEditor value={data} onChange={(v) => { setData(v); setResult(null); }} placeholder="Paste JSON data to validate…" height="380px" />
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-xs font-medium text-muted-foreground px-1">JSON Schema</span>
          <CodeEditor value={schema} onChange={(v) => { setSchema(v); setResult(null); }} placeholder="Paste JSON Schema (Draft 7/2019/2020)…" height="380px" />
        </div>
      </div>
    </div>
  );
}
