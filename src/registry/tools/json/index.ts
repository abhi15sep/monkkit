import type { ToolDefinition } from "@/types/registry";
import { jsonValidatorTool } from "./validator";
import { jsonFormatterTool } from "./formatter";
import { jsonMinifyTool } from "./minify";
import { jsonRepairTool } from "./repair";
import { jsonEscapeTool } from "./escape";
import { jsonUnescapeTool } from "./unescape";
import { jsonStringifyTool } from "./stringify";
import { jsonSortTool } from "./sort";

export const jsonTools: ToolDefinition[] = [
  jsonValidatorTool,
  jsonFormatterTool,
  jsonMinifyTool,
  jsonRepairTool,
  jsonEscapeTool,
  jsonUnescapeTool,
  jsonStringifyTool,
  jsonSortTool,
];
