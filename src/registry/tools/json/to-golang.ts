import type { ToolDefinition } from "@/types/registry";
import { process } from "@/tools/json/to-golang/logic";
export const jsonToGolangTool: ToolDefinition = {
  id: "json-to-golang", slug: "to-golang", name: "JSON → Go",
  shortDescription: "Generate Go structs with JSON tags from JSON.",
  description: "Generate idiomatic Go structs with json struct tags from any JSON sample using quicktype.",
  category: "json", tags: ["go", "golang", "codegen", "struct"], keywords: ["json to go struct", "generate go struct from json"],
  icon: "FileCode2", status: "new",
  component: () => import("@/tools/json/to-golang"), process,
};
