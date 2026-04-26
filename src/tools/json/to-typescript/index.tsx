"use client";
import { CodegenTool } from "../_codegen/CodegenTool";
import type { ToolComponentProps } from "@/types/registry";
export default function JsonToTypescript({ toolMeta: _ }: ToolComponentProps) {
  return <CodegenTool lang="typescript" label="TypeScript" />;
}
