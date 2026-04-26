import type { ToolDefinition } from "@/types/registry";
import { process } from "@/tools/json/flatten/logic";

export const jsonFlattenTool: ToolDefinition = {
  id: "json-flatten",
  slug: "flatten",
  name: "JSON Flatten",
  shortDescription: "Flatten nested JSON into a single-level object with dot-notation keys.",
  description:
    "Convert a deeply nested JSON object into a flat key-value map. Nested keys are joined with a configurable delimiter (. _ /). Arrays are indexed as key[0], key[1], etc.",
  category: "json",
  tags: ["flatten", "transform", "keys"],
  keywords: ["json flatten online", "flatten nested json", "json to flat object"],
  icon: "Layers",
  status: "new",
  component: () => import("@/tools/json/flatten"),
  process,
};
