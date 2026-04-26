import type { ToolDefinition } from "@/types/registry";
import { process } from "@/tools/json/unescape/logic";

export const jsonUnescapeTool: ToolDefinition = {
  id: "json-unescape",
  slug: "unescape",
  name: "JSON Unescape",
  shortDescription: "Unescape a JSON-encoded string back to human-readable text.",
  description:
    "Reverse JSON string escaping — convert \\n, \\t, \\\", \\\\ and other escape sequences back to their original characters. Useful for reading double-encoded JSON payloads.",
  category: "json",
  tags: ["unescape", "decode", "string"],
  keywords: ["json unescape string", "unescape json", "json decode string"],
  icon: "ArrowLeftFromLine",
  status: "new",
  component: () => import("@/tools/json/unescape"),
  process,
};
