import type { ToolDefinition } from "@/types/registry";
import { process } from "@/tools/json/from-xml/logic";

export const xmlToJsonTool: ToolDefinition = {
  id: "json-from-xml", slug: "from-xml", name: "XML → JSON",
  shortDescription: "Parse XML and convert it to JSON.",
  description: "Parse any XML document and convert it to a JSON object. Attributes are preserved with the @_ prefix. Handles nested elements and text content.",
  category: "json", tags: ["xml", "convert", "import"], keywords: ["xml to json", "convert xml to json online"],
  icon: "Code2", status: "new",
  component: () => import("@/tools/json/from-xml"), process,
};
