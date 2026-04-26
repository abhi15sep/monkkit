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

const SAMPLE_ENCODE = `<h1 class="title">Hello & "World"</h1>
<p>Copyright © 2024 — All rights reserved™</p>`;

const SAMPLE_DECODE = `&lt;h1 class=&quot;title&quot;&gt;Hello &amp; &quot;World&quot;&lt;/h1&gt;
&lt;p&gt;Copyright &copy; 2024 &mdash; All rights reserved&trade;&lt;/p&gt;`;

export default function HtmlEntitiesTool({ toolMeta: _ }: ToolComponentProps) {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [outputKey, setOutputKey] = useState(0);
  const [error, setError] = useState("");

  const run = (mode: "encode" | "decode") => {
    const r = process({ input, mode });
    if (r.success) { setOutput(r.output!); setError(""); }
    else { setOutput(""); setError(r.error!); }
    setOutputKey((k) => k + 1);
  };

  const resetInput = (val: string) => { setInput(val); setOutput(""); setError(""); };

  return (
    <div className="flex flex-col gap-3 p-4">
      <div className="flex flex-wrap items-center gap-2">
        <Button size="sm" onClick={() => run("encode")} disabled={!input.trim()}>Encode HTML</Button>
        <Button size="sm" onClick={() => run("decode")} disabled={!input.trim()} variant="outline">Decode Entities</Button>
        <Button size="sm" variant="outline" onClick={() => resetInput(SAMPLE_ENCODE)}>Sample (encode)</Button>
        <Button size="sm" variant="outline" onClick={() => resetInput(SAMPLE_DECODE)}>Sample (decode)</Button>
        <PasteButton onPaste={resetInput} />
        <ClearButton onClick={() => resetInput("")} />
      </div>
      {error && <ErrorDisplay message={error} />}
      <SplitPane
        left={
          <CodeEditor
            value={input}
            onChange={setInput}
            language="plaintext"
            placeholder="Paste HTML or encoded entities here..."
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
