import type { ToolDefinition } from "@/types/registry";
import { process } from "@/tools/json/minify/logic";

export const jsonMinifyTool: ToolDefinition = {
  id: "json-minify",
  slug: "minify",
  name: "JSON Minify",
  shortDescription: "Remove all whitespace from JSON to produce the smallest possible output.",
  description:
    "Strip all whitespace, newlines, and indentation from JSON to minimise payload size. Shows original vs minified byte count and percentage saved — useful for optimising API responses and config files.",
  category: "json",
  tags: ["minify", "compress", "strip", "size"],
  keywords: ["json minify online", "json compress", "json strip whitespace", "minify json"],
  icon: "Minimize2",
  status: "stable",
  component: () => import("@/tools/json/minify"),
  process,
};
