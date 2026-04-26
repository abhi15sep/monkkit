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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { process } from "./logic";
import type { ToolComponentProps } from "@/types/registry";
import type { UrlEncodeMode } from "./logic";

const SAMPLE = `https://example.com/search?q=hello world&lang=en&emoji=🌍`;

export default function UrlEncodeTool({ toolMeta: _ }: ToolComponentProps) {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [outputKey, setOutputKey] = useState(0);
  const [error, setError] = useState("");
  const [encodeMode, setEncodeMode] = useState<UrlEncodeMode>("component");

  const run = (mode: "encode" | "decode") => {
    const r = process({ input, mode, encodeMode });
    if (r.success) { setOutput(r.output!); setError(""); }
    else { setOutput(""); setError(r.error!); }
    setOutputKey((k) => k + 1);
  };

  const resetInput = (val: string) => { setInput(val); setOutput(""); setError(""); };

  return (
    <div className="flex flex-col gap-3 p-4">
      <div className="flex flex-wrap items-center gap-2">
        <Button size="sm" onClick={() => run("encode")} disabled={!input.trim()}>Encode</Button>
        <Button size="sm" onClick={() => run("decode")} disabled={!input.trim()} variant="outline">Decode</Button>
        <Button size="sm" variant="outline" onClick={() => resetInput(SAMPLE)}>Sample</Button>
        <PasteButton onPaste={resetInput} />
        <ClearButton onClick={() => resetInput("")} />
        <div className="ml-auto flex items-center gap-2">
          <Label className="text-sm text-muted-foreground">Mode:</Label>
          <Select value={encodeMode} onValueChange={(v) => setEncodeMode(v as UrlEncodeMode)}>
            <SelectTrigger className="h-8 w-48 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="component">encodeURIComponent (strict)</SelectItem>
              <SelectItem value="full">encodeURI (full URL)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      {error && <ErrorDisplay message={error} />}
      <SplitPane
        left={
          <CodeEditor
            value={input}
            onChange={setInput}
            language="plaintext"
            placeholder="Paste URL or encoded string here..."
          />
        }
        right={
          <div className="relative h-full">
            <div className="absolute top-2 right-2 z-10"><CopyButton value={output} /></div>
            <CodeEditor key={outputKey} value={output} readOnly language="plaintext" placeholder="Output appears here..." />
          </div>
        }
      />
    </div>
  );
}
