"use client";
import { CodegenTool } from "../_codegen/CodegenTool";
import type { ToolComponentProps } from "@/types/registry";
export default function JsonToGolang({ toolMeta: _ }: ToolComponentProps) {
  return <CodegenTool lang="golang" label="Go" />;
}
