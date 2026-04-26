import type { ToolDefinition } from "@/types/registry";
import { process } from "@/tools/json/schema-generate/logic";
export const jsonSchemaGenerateTool: ToolDefinition = {
  id: "json-schema-generate", slug: "schema-generate", name: "JSON Schema Generator",
  shortDescription: "Infer a JSON Schema from an example JSON document.",
  description: "Paste any JSON and get a JSON Schema inferred from its structure. Detects types, required fields, nested objects, and arrays. Choose Draft 7, 2019-09, or 2020-12 output.",
  category: "json", tags: ["schema", "generate", "infer"], keywords: ["json schema generator online", "generate json schema from json"],
  icon: "Wand2", status: "new",
  component: () => import("@/tools/json/schema-generate"), process,
};
