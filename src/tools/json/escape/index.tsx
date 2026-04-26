"use client";

import { useState } from "react";
import { CodeEditor } from "@/components/tool-ui/CodeEditor";
import { SplitPane } from "@/components/tool-ui/SplitPane";
import { CopyButton } from "@/components/tool-ui/CopyButton";
import { PasteButton } from "@/components/tool-ui/PasteButton";
import { ClearButton } from "@/components/tool-ui/ClearButton";
import { ErrorDisplay } from "@/components/tool-ui/ErrorDisplay";
import { Button } from "@/components/ui/button";
import { process } from "./logic";
import type { ToolComponentProps } from "@/types/registry";

const SAMPLE = `{"name": "Alice Johnson", "message": "Hello,\nWelcome to \"MonkKit\"!\nLine 3 here."}`;

export default function JsonEscape({ toolMeta: _ }: ToolComponentProps) {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [outputKey, setOutputKey] = useState(0);
  const [error, setError] = useState("");

  const handleEscape = () => {
    const r = process({ input });
    if (r.success) {
      setOutput(r.output!);
      setError("");
      setOutputKey((k) => k + 1);
    } else {
      setOutput("");
      setError(r.error!);
    }
  };

  const resetInput = (val: string) => {
    setInput(val);
    setOutput("");
    setError("");
  };

  return (
    <div className="flex flex-col gap-3 p-4">
      <div className="flex flex-wrap items-center gap-2">
        <Button size="sm" onClick={handleEscape} disabled={!input.trim()}>
          Escape
        </Button>
        <Button size="sm" variant="outline" onClick={() => resetInput(SAMPLE)}>
          Sample
        </Button>
        <PasteButton onPaste={resetInput} />
        <ClearButton onClick={() => resetInput("")} />
      </div>

      {error && <ErrorDisplay message={error} />}

      <SplitPane
        left={
          <CodeEditor
            value={input}
            onChange={resetInput}
            placeholder={"Paste JSON or text to escape…\ne.g. {\"name\": \"Alice\"}"}
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
                Escaped string will appear here
              </div>
            )}
          </div>
        }
      />
    </div>
  );
}
