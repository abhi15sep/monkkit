"use client";
import { CodegenTool } from "../_codegen/CodegenTool";
import type { ToolComponentProps } from "@/types/registry";
export default function JsonToPython({ toolMeta: _ }: ToolComponentProps) {
  return <CodegenTool lang="python" label="Python" />;
}
