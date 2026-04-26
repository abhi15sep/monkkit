import type { ToolDefinition } from "@/types/registry";
import { jsonToolsTool } from "./validator";
import { jsonRepairTool } from "./repair";
import { jsonEscapeTool } from "./escape";
import { jsonUnescapeTool } from "./unescape";
import { jsonStringifyTool } from "./stringify";
import { jsonSortTool } from "./sort";

export const jsonTools: ToolDefinition[] = [
  jsonToolsTool,
  jsonRepairTool,
  jsonEscapeTool,
  jsonUnescapeTool,
  jsonStringifyTool,
  jsonSortTool,
];
