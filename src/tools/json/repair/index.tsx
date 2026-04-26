"use client";

import { useState } from "react";
import { CheckCircle, Wrench } from "lucide-react";
import { CodeEditor } from "@/components/tool-ui/CodeEditor";
import { SplitPane } from "@/components/tool-ui/SplitPane";
import { CopyButton } from "@/components/tool-ui/CopyButton";
import { PasteButton } from "@/components/tool-ui/PasteButton";
import { ClearButton } from "@/components/tool-ui/ClearButton";
import { ErrorDisplay } from "@/components/tool-ui/ErrorDisplay";
import { Button } from "@/components/ui/button";
import { process } from "./logic";
import type { ToolComponentProps } from "@/types/registry";

export default function JsonRepair({ toolMeta: _ }: ToolComponentProps) {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [outputKey, setOutputKey] = useState(0);
  const [error, setError] = useState("");
  const [wasAlreadyValid, setWasAlreadyValid] = useState<boolean | null>(null);

  const handleRepair = () => {
    const r = process({ input });
    if (r.success) {
      setOutput(r.output!);
      setError("");
      setWasAlreadyValid(r.wasAlreadyValid ?? null);
      setOutputKey((k) => k + 1);
    } else {
      setOutput("");
      setError(r.error!);
      setWasAlreadyValid(null);
    }
  };

  const resetInput = (val: string) => {
    setInput(val);
    setOutput("");
    setError("");
    setWasAlreadyValid(null);
  };

  return (
    <div className="flex flex-col gap-3 p-4">
      <div className="flex flex-wrap items-center gap-2">
        <Button size="sm" onClick={handleRepair} disabled={!input.trim()}>
          <Wrench className="h-3.5 w-3.5 mr-1.5" />
          Repair JSON
        </Button>
        <PasteButton onPaste={resetInput} />
        <ClearButton onClick={() => resetInput("")} />
      </div>

      {wasAlreadyValid !== null && (
        <div className="flex items-center gap-2 text-sm font-medium text-green-500">
          <CheckCircle className="h-4 w-4" />
          <span>{wasAlreadyValid ? "Already valid JSON — no changes needed" : "JSON repaired successfully"}</span>
        </div>
      )}

      {error && <ErrorDisplay message={error} />}

      <SplitPane
        left={
          <CodeEditor
            value={input}
            onChange={resetInput}
            placeholder={"Paste broken JSON here…\ne.g. {name: 'Alice', age: 30,}"}
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
                <CodeEditor key={outputKey} value={output} readOnly height="390px" />
              </>
            ) : (
              <div
                className="flex items-center justify-center rounded-lg border border-border/50 bg-muted/20 text-sm text-muted-foreground"
                style={{ height: "420px" }}
              >
                Repaired JSON will appear here
              </div>
            )}
          </div>
        }
      />
    </div>
  );
}
