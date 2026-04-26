import type { ToolDefinition } from "@/types/registry";
import { jsonToolsTool } from "./validator";
import { jsonRepairTool } from "./repair";
import { jsonEscapeTool } from "./escape";
import { jsonUnescapeTool } from "./unescape";
import { jsonStringifyTool } from "./stringify";
import { jsonSortTool } from "./sort";
import { jsonDiffTool } from "./diff";
import { jsonPathTool } from "./jsonpath";
import { jsonFlattenTool } from "./flatten";
import { jsonUnflattenTool } from "./unflatten";
import { jsonSizeTool } from "./size";
import { jsonSearchTool } from "./search";

export const jsonTools: ToolDefinition[] = [
  jsonToolsTool,
  jsonRepairTool,
  jsonEscapeTool,
  jsonUnescapeTool,
  jsonStringifyTool,
  jsonSortTool,
  jsonDiffTool,
  jsonPathTool,
  jsonFlattenTool,
  jsonUnflattenTool,
  jsonSizeTool,
  jsonSearchTool,
];
