import type { ToolDefinition } from "@/types/registry";
import { process } from "@/tools/json/formatter/logic";

export const jsonFormatterTool: ToolDefinition = {
  id: "json-formatter",
  slug: "formatter",
  name: "JSON Formatter",
  shortDescription: "Pretty-print JSON with configurable indentation and optional key sorting.",
  description:
    "Format and pretty-print any JSON with 2 or 4-space indentation. Optionally sort all object keys alphabetically for consistent output. Works with nested objects and arrays of any depth.",
  category: "json",
  tags: ["format", "pretty-print", "beautify", "sort"],
  keywords: ["json formatter online", "json pretty print", "json beautifier", "json sort keys"],
  icon: "AlignLeft",
  status: "stable",
  component: () => import("@/tools/json/formatter"),
  process,
};
