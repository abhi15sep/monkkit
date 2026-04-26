import type { ToolDefinition } from "@/types/registry";
import { process } from "@/tools/json/sort/logic";

export const jsonSortTool: ToolDefinition = {
  id: "json-sort",
  slug: "sort",
  name: "JSON Sort",
  shortDescription: "Sort all object keys alphabetically (A→Z or Z→A), deeply nested.",
  description:
    "Recursively sort all object keys in a JSON document alphabetically. Choose ascending (A→Z) or descending (Z→A) order. Arrays are preserved in their original order — only object keys are sorted.",
  category: "json",
  tags: ["sort", "keys", "alphabetical", "format"],
  keywords: ["json sort keys", "sort json alphabetically", "json key sorter"],
  icon: "ArrowUpDown",
  status: "new",
  component: () => import("@/tools/json/sort"),
  process,
};
