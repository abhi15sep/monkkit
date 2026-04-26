"use client";
import { CodegenTool } from "../_codegen/CodegenTool";
import type { ToolComponentProps } from "@/types/registry";
export default function JsonToJava({ toolMeta: _ }: ToolComponentProps) {
  return <CodegenTool lang="java" label="Java" />;
}
