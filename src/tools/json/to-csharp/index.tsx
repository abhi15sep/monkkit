"use client";
import { CodegenTool } from "../_codegen/CodegenTool";
import type { ToolComponentProps } from "@/types/registry";
export default function JsonToCsharp({ toolMeta: _ }: ToolComponentProps) {
  return <CodegenTool lang="csharp" label="C#" />;
}
