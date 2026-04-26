import type { ToolDefinition } from "@/types/registry";
import { process } from "@/tools/json/schema-validate/logic";
export const jsonSchemaValidateTool: ToolDefinition = {
  id: "json-schema-validate", slug: "schema-validate", name: "JSON Schema Validator",
  shortDescription: "Validate JSON data against a JSON Schema (Draft 7/2019/2020).",
  description: "Paste your JSON data and a JSON Schema to validate against. Powered by AJV — reports all errors with paths, keywords, and messages. Supports Draft 7, 2019-09, and 2020-12.",
  category: "json", tags: ["schema", "validate", "ajv"], keywords: ["json schema validator online", "ajv json validate", "validate json against schema"],
  icon: "ShieldCheck", status: "new",
  component: () => import("@/tools/json/schema-validate"), process,
};
