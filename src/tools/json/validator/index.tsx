"use client";

import { useState } from "react";
import { CheckCircle, XCircle } from "lucide-react";
import { CodeEditor } from "@/components/tool-ui/CodeEditor";
import { SplitPane } from "@/components/tool-ui/SplitPane";
import { CopyButton } from "@/components/tool-ui/CopyButton";
import { PasteButton } from "@/components/tool-ui/PasteButton";
import { ClearButton } from "@/components/tool-ui/ClearButton";
import { ErrorDisplay } from "@/components/tool-ui/ErrorDisplay";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { process as validate } from "./logic";
import { process as format } from "../formatter/logic";
import { process as minify } from "../minify/logic";
import type { ToolComponentProps } from "@/types/registry";

const INDENT_OPTIONS = [2, 4] as const;

export default function JsonTool({ toolMeta: _ }: ToolComponentProps) {
  const [input, setInput] = useState("");
  const [indent, setIndent] = useState<2 | 4>(2);
  const [sortKeys, setSortKeys] = useState(false);
  const [output, setOutput] = useState("");
  const [outputKey, setOutputKey] = useState(0); // forces CodeEditor remount → scrolls to top
  const [error, setError] = useState("");
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [minifyStats, setMinifyStats] = useState<{ original: number; minified: number; savings: number } | null>(null);

  function setResult(ok: boolean, text: string, err = "") {
    setIsValid(ok);
    setOutput(text);
    setError(err);
    setOutputKey((k) => k + 1);
    setMinifyStats(null);
  }

  const handleFormat = () => {
    const r = format({ input, indent, sortKeys });
    r.success ? setResult(true, r.output!) : setResult(false, "", r.error!);
  };

  const handleMinify = () => {
    const r = minify({ input });
    if (r.success) {
      setResult(true, r.output!);
      setMinifyStats({ original: r.originalSize!, minified: r.minifiedSize!, savings: r.savings! });
    } else {
      setResult(false, "", r.error!);
    }
  };

  const handleValidate = () => {
    const r = validate({ input, indent });
    r.valid ? setResult(true, r.formatted!) : setResult(false, "", r.error!.message);
  };

  const resetInput = (val: string) => {
    setInput(val);
    setOutput("");
    setError("");
    setIsValid(null);
    setMinifyStats(null);
  };

  return (
    <div className="flex flex-col gap-3 p-4">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Primary actions */}
        <Button size="sm" onClick={handleFormat} disabled={!input.trim()}>
          Format
        </Button>
        <Button size="sm" variant="outline" onClick={handleMinify} disabled={!input.trim()}>
          Minify
        </Button>
        <Button size="sm" variant="outline" onClick={handleValidate} disabled={!input.trim()}>
          Validate
        </Button>
        <PasteButton onPaste={resetInput} />
        <ClearButton onClick={() => resetInput("")} />

        {/* Options — right aligned */}
        <div className="ml-auto flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Switch
              id="sort-keys"
              checked={sortKeys}
              onCheckedChange={(v) => { setSortKeys(v); setOutput(""); setIsValid(null); }}
            />
            <Label htmlFor="sort-keys" className="text-xs text-muted-foreground cursor-pointer select-none">
              Sort keys
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <Label className="text-xs text-muted-foreground">Indent</Label>
            {INDENT_OPTIONS.map((n) => (
              <Button
                key={n}
                size="sm"
                variant={indent === n ? "default" : "outline"}
                className="w-8 px-0"
                onClick={() => setIndent(n)}
              >
                {n}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Status row */}
      {isValid !== null && (
        <div className={`flex items-center gap-2 text-sm font-medium ${isValid ? "text-green-500" : "text-destructive"}`}>
          {isValid ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
          <span>{isValid ? "Valid JSON" : "Invalid JSON"}</span>
          {minifyStats && (
            <span className="ml-2 text-xs font-normal text-muted-foreground">
              {minifyStats.original} B → {minifyStats.minified} B
              <span className="text-green-500 font-semibold ml-1">−{minifyStats.savings}%</span>
            </span>
          )}
        </div>
      )}

      {error && <ErrorDisplay message={error} />}

      {/* Split pane */}
      <SplitPane
        left={
          <CodeEditor
            value={input}
            onChange={resetInput}
            placeholder='Paste JSON here…'
            height="420px"
          />
        }
        right={
          <div className="flex flex-col gap-2 h-full">
            {output ? (
              <>
                <div className="flex justify-end">
                  <CopyButton value={output} />
                </div>
                {/* key prop resets scroll position to top on every new result */}
                <CodeEditor key={outputKey} value={output} readOnly height="390px" />
              </>
            ) : (
              <div className="flex items-center justify-center rounded-lg border border-border/50 bg-muted/20 text-sm text-muted-foreground" style={{ height: "420px" }}>
                Output will appear here
              </div>
            )}
          </div>
        }
      />
    </div>
  );
}
