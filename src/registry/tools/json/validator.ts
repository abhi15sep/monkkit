import type { ToolDefinition } from "@/types/registry";
import { process } from "@/tools/json/validator/logic";

export const jsonToolsTool: ToolDefinition = {
  id: "json-validator",
  slug: "validator",
  name: "JSON Tools",
  shortDescription: "Format, minify, and validate JSON in one place.",
  description:
    "All-in-one JSON tool: pretty-print with configurable indentation, minify to the smallest payload, or validate and get clear error messages with line and column numbers.",
  category: "json",
  tags: ["validate", "format", "minify", "lint", "pretty-print"],
  keywords: ["json formatter online", "json validator", "json minify", "json pretty print", "json lint"],
  icon: "Braces",
  status: "stable",
  component: () => import("@/tools/json/validator"),
  process,
};
