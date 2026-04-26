"use client";

import CodeMirror from "@uiw/react-codemirror";
import { json } from "@codemirror/lang-json";
import { yaml } from "@codemirror/lang-yaml";
import { xml } from "@codemirror/lang-xml";
import { sql } from "@codemirror/lang-sql";
import { oneDark } from "@codemirror/theme-one-dark";
import { EditorView } from "@codemirror/view";

const LANG_MAP = { json, yaml, xml, sql };

interface Props {
  value: string;
  onChange?: (value: string) => void;
  language?: keyof typeof LANG_MAP | "plaintext";
  readOnly?: boolean;
  height?: string;
  placeholder?: string;
}

export function CodeEditor({
  value,
  onChange,
  language = "json",
  readOnly = false,
  height = "320px",
  placeholder,
}: Props) {
  const extensions = [
    language !== "plaintext" && LANG_MAP[language as keyof typeof LANG_MAP]
      ? LANG_MAP[language as keyof typeof LANG_MAP]()
      : [],
    readOnly ? EditorView.editable.of(false) : [],
    EditorView.theme({
      "&": { borderRadius: "0.5rem" },
      ".cm-scroller": { fontFamily: "var(--font-mono, monospace)" },
    }),
  ].flat();

  return (
    <CodeMirror
      value={value}
      height={height}
      theme={oneDark}
      extensions={extensions}
      onChange={onChange}
      placeholder={placeholder}
      basicSetup={{
        lineNumbers: true,
        foldGutter: true,
        highlightActiveLine: !readOnly,
        autocompletion: !readOnly,
      }}
      className="rounded-lg overflow-hidden border border-border/50 text-sm"
    />
  );
}
