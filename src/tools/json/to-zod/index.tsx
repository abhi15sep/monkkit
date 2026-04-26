"use client";
import { CodegenTool } from "../_codegen/CodegenTool";
import type { ToolComponentProps } from "@/types/registry";
export default function JsonToZod({ toolMeta: _ }: ToolComponentProps) {
  return <CodegenTool lang="zod" label="Zod Schema" />;
}
