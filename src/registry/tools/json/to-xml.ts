import type { ToolDefinition } from "@/types/registry";
import { process } from "@/tools/json/to-xml/logic";

export const jsonToXmlTool: ToolDefinition = {
  id: "json-to-xml", slug: "to-xml", name: "JSON → XML",
  shortDescription: "Convert JSON to well-formed XML with a configurable root tag.",
  description: "Convert any JSON object to indented, well-formed XML. Set the root element tag name and get an XML declaration header automatically.",
  category: "json", tags: ["xml", "convert", "export"], keywords: ["json to xml", "convert json to xml online"],
  icon: "Code2", status: "new",
  component: () => import("@/tools/json/to-xml"), process,
};
