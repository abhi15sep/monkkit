import type { ToolDefinition } from "@/types/registry";
import { process } from "@/tools/json/to-java/logic";
export const jsonToJavaTool: ToolDefinition = {
  id: "json-to-java", slug: "to-java", name: "JSON → Java",
  shortDescription: "Generate Java POJOs from JSON.",
  description: "Generate Java classes with getters/setters and Jackson annotations from any JSON sample using quicktype.",
  category: "json", tags: ["java", "codegen", "pojo"], keywords: ["json to java class", "generate java pojo from json"],
  icon: "FileCode2", status: "new",
  component: () => import("@/tools/json/to-java"), process,
};
