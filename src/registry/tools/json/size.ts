import type { ToolDefinition } from "@/types/registry";
import { process } from "@/tools/json/size/logic";

export const jsonSizeTool: ToolDefinition = {
  id: "json-size",
  slug: "size",
  name: "JSON Size Analyzer",
  shortDescription: "Analyze JSON byte size, key count, nesting depth, and type breakdown.",
  description:
    "Get a full size report for any JSON: raw byte size, minified size and savings, total key count, leaf value count, maximum nesting depth, and a breakdown of value types (string, number, boolean, null, array, object).",
  category: "json",
  tags: ["size", "analyze", "metrics", "stats"],
  keywords: ["json size calculator", "json analyzer", "json byte size", "json stats"],
  icon: "BarChart2",
  status: "new",
  component: () => import("@/tools/json/size"),
  process,
};
