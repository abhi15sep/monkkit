import type { ToolDefinition } from "@/types/registry";
import { process } from "@/tools/json/escape/logic";

export const jsonEscapeTool: ToolDefinition = {
  id: "json-escape",
  slug: "escape",
  name: "JSON Escape",
  shortDescription: "Escape special characters in a string for safe embedding in JSON.",
  description:
    "Escape a string so it can be safely embedded inside a JSON value. Converts quotes, backslashes, newlines, tabs, and other control characters to their escaped equivalents.",
  category: "json",
  tags: ["escape", "encode", "string"],
  keywords: ["json escape string", "escape json characters", "json string escape"],
  icon: "ArrowRightFromLine",
  status: "new",
  component: () => import("@/tools/json/escape"),
  process,
};
