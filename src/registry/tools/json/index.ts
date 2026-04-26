import type { ToolDefinition } from "@/types/registry";
import { jsonValidatorTool } from "./validator";
import { jsonFormatterTool } from "./formatter";
import { jsonMinifyTool } from "./minify";

export const jsonTools: ToolDefinition[] = [
  jsonValidatorTool,
  jsonFormatterTool,
  jsonMinifyTool,
];
