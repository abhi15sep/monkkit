import type { ToolDefinition } from "@/types/registry";
import { process } from "@/tools/json/unflatten/logic";

export const jsonUnflattenTool: ToolDefinition = {
  id: "json-unflatten",
  slug: "unflatten",
  name: "JSON Unflatten",
  shortDescription: "Restore a flat dot-notation object back to a nested JSON structure.",
  description:
    "Reverse a flattened JSON object back into a nested structure. Splits dot-notation keys (or custom delimiter) and rebuilds the original hierarchy.",
  category: "json",
  tags: ["unflatten", "transform", "nested"],
  keywords: ["json unflatten", "flat to nested json", "json restore structure"],
  icon: "Network",
  status: "new",
  component: () => import("@/tools/json/unflatten"),
  process,
};
