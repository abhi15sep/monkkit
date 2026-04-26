"use client";
import { CodegenTool } from "../_codegen/CodegenTool";
import type { ToolComponentProps } from "@/types/registry";
export default function JsonToRust({ toolMeta: _ }: ToolComponentProps) {
  return <CodegenTool lang="rust" label="Rust" />;
}
