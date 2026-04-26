import type { ToolDefinition } from "@/types/registry";
import { process } from "@/tools/json/to-typescript/logic";
export const jsonToTypescriptTool: ToolDefinition = {
  id: "json-to-typescript", slug: "to-typescript", name: "JSON → TypeScript",
  shortDescription: "Generate TypeScript interfaces from JSON.",
  description: "Infer TypeScript interfaces and types from any JSON sample. Powered by quicktype — handles nested objects, arrays, optional fields, and union types.",
  category: "json", tags: ["typescript", "codegen", "types"], keywords: ["json to typescript", "generate typescript interface from json"],
  icon: "FileType", status: "new",
  component: () => import("@/tools/json/to-typescript"), process,
};
