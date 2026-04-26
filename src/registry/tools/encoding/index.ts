import type { ToolDefinition } from "@/types/registry";
import { base64Tool } from "./base64";
import { urlEncodeTool } from "./url-encode";
import { htmlEntitiesTool } from "./html-entities";
import { hashTool } from "./hash";

export const encodingTools: ToolDefinition[] = [
  base64Tool,
  urlEncodeTool,
  htmlEntitiesTool,
  hashTool,
];
