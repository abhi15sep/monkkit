import type { ToolDefinition } from "@/types/registry";
import { process } from "@/tools/json/to-csharp/logic";
export const jsonToCsharpTool: ToolDefinition = {
  id: "json-to-csharp", slug: "to-csharp", name: "JSON → C#",
  shortDescription: "Generate C# classes from JSON.",
  description: "Generate C# classes with Newtonsoft.Json or System.Text.Json attributes from any JSON sample using quicktype.",
  category: "json", tags: ["csharp", "dotnet", "codegen"], keywords: ["json to csharp", "generate c# class from json"],
  icon: "FileCode2", status: "new",
  component: () => import("@/tools/json/to-csharp"), process,
};
