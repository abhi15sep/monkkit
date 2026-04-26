import type { ToolDefinition } from "@/types/registry";
import { process } from "@/tools/json/to-toml/logic";

export const jsonToTomlTool: ToolDefinition = {
  id: "json-to-toml", slug: "to-toml", name: "JSON → TOML",
  shortDescription: "Convert JSON config objects to TOML format.",
  description: "Convert a JSON object to TOML configuration format. Great for converting package.json or config files to TOML. Requires a top-level object (not an array).",
  category: "json", tags: ["toml", "convert", "config"], keywords: ["json to toml", "convert json to toml online"],
  icon: "Settings", status: "new",
  component: () => import("@/tools/json/to-toml"), process,
};
