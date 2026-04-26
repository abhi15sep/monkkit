import type { ToolDefinition } from "@/types/registry";
import { process } from "@/tools/json/validator/logic";

export const jsonValidatorTool: ToolDefinition = {
  id: "json-validator",
  slug: "validator",
  name: "JSON Validator",
  shortDescription: "Validate JSON and highlight syntax errors with line numbers.",
  description:
    "Paste any JSON string to instantly validate it. Get clear error messages with line and column numbers. Optionally pretty-print the output with configurable indentation.",
  category: "json",
  tags: ["validate", "lint", "check", "format"],
  keywords: ["json validator online", "json lint", "check json syntax", "json checker"],
  icon: "ShieldCheck",
  status: "stable",
  component: () => import("@/tools/json/validator"),
  process,
};
