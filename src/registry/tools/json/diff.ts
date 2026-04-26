import type { ToolDefinition } from "@/types/registry";
import { process } from "@/tools/json/diff/logic";

export const jsonDiffTool: ToolDefinition = {
  id: "json-diff",
  slug: "diff",
  name: "JSON Diff",
  shortDescription: "Compare two JSON objects and highlight added, removed, and changed fields.",
  description:
    "Paste two JSON objects and instantly see what changed between them. Differences are shown per path: added fields in green, removed in red, changed values in yellow.",
  category: "json",
  tags: ["diff", "compare", "delta"],
  keywords: ["json diff online", "compare json", "json compare tool", "json difference"],
  icon: "GitCompare",
  status: "new",
  component: () => import("@/tools/json/diff"),
  process,
};
