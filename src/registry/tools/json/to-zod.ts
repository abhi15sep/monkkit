import type { ToolDefinition } from "@/types/registry";
import { process } from "@/tools/json/to-zod/logic";
export const jsonToZodTool: ToolDefinition = {
  id: "json-to-zod", slug: "to-zod", name: "JSON → Zod Schema",
  shortDescription: "Generate a Zod validation schema from JSON.",
  description: "Infer a Zod schema from any JSON sample — great for adding runtime validation to TypeScript projects. Powered by quicktype.",
  category: "json", tags: ["zod", "schema", "validation", "typescript"], keywords: ["json to zod schema", "generate zod schema from json"],
  icon: "ShieldCheck", status: "new",
  component: () => import("@/tools/json/to-zod"), process,
};
