import type { ToolDefinition } from "@/types/registry";
import { process } from "@/tools/json/to-python/logic";
export const jsonToPythonTool: ToolDefinition = {
  id: "json-to-python", slug: "to-python", name: "JSON → Python",
  shortDescription: "Generate Python dataclasses from JSON.",
  description: "Generate Python dataclass or TypedDict definitions from any JSON sample using quicktype.",
  category: "json", tags: ["python", "codegen", "dataclass"], keywords: ["json to python", "generate python class from json"],
  icon: "FileCode2", status: "new",
  component: () => import("@/tools/json/to-python"), process,
};
