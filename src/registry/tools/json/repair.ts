import type { ToolDefinition } from "@/types/registry";
import { process } from "@/tools/json/repair/logic";

export const jsonRepairTool: ToolDefinition = {
  id: "json-repair",
  slug: "repair",
  name: "JSON Repair",
  shortDescription: "Fix broken JSON — trailing commas, single quotes, unquoted keys, and more.",
  description:
    "Automatically repair malformed JSON. Handles trailing commas, single-quoted strings, unquoted keys, missing brackets, comments, and other common mistakes. Powered by the jsonrepair library.",
  category: "json",
  tags: ["repair", "fix", "lint", "validate"],
  keywords: ["json repair", "fix broken json", "json fixer", "invalid json repair"],
  icon: "Wrench",
  status: "new",
  component: () => import("@/tools/json/repair"),
  process,
};
