import type { ToolDefinition } from "@/types/registry";
import { process } from "@/tools/json/stringify/logic";

export const jsonStringifyTool: ToolDefinition = {
  id: "json-stringify",
  slug: "stringify",
  name: "JSON Stringify",
  shortDescription: "Convert a JavaScript object literal to valid, spec-compliant JSON.",
  description:
    "Paste a JavaScript object literal (with single quotes, unquoted keys, trailing commas) and get back a valid JSON string with double-quoted keys and values. Useful for converting JS config objects to JSON.",
  category: "json",
  tags: ["stringify", "convert", "javascript", "object"],
  keywords: ["json stringify online", "js object to json", "javascript to json converter"],
  icon: "Code",
  status: "new",
  component: () => import("@/tools/json/stringify"),
  process,
};
