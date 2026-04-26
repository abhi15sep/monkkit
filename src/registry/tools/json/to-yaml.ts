import type { ToolDefinition } from "@/types/registry";
import { process } from "@/tools/json/to-yaml/logic";

export const jsonToYamlTool: ToolDefinition = {
  id: "json-to-yaml", slug: "to-yaml", name: "JSON → YAML",
  shortDescription: "Convert JSON to YAML format.",
  description: "Convert any JSON object or array to clean, readable YAML. Supports configurable indentation.",
  category: "json", tags: ["yaml", "convert", "export"], keywords: ["json to yaml", "convert json to yaml online"],
  icon: "FileCode", status: "new",
  component: () => import("@/tools/json/to-yaml"), process,
};
