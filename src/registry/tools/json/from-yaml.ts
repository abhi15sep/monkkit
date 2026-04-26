import type { ToolDefinition } from "@/types/registry";
import { process } from "@/tools/json/from-yaml/logic";

export const yamlToJsonTool: ToolDefinition = {
  id: "json-from-yaml", slug: "from-yaml", name: "YAML → JSON",
  shortDescription: "Convert YAML to JSON format.",
  description: "Parse any YAML document and convert it to formatted JSON. Handles anchors, aliases, and multi-document YAML.",
  category: "json", tags: ["yaml", "convert", "import"], keywords: ["yaml to json", "convert yaml to json online"],
  icon: "FileCode", status: "new",
  component: () => import("@/tools/json/from-yaml"), process,
};
