import type { ToolDefinition } from "@/types/registry";

export const htmlEntitiesTool: ToolDefinition = {
  id: "encoding-html-entities",
  slug: "html-entities",
  name: "HTML Entities Encode / Decode",
  shortDescription: "Encode special chars to HTML entities or decode them back.",
  description:
    "Convert HTML special characters (&, <, >, \", ') to their entity equivalents for safe rendering in HTML, or decode named and numeric entities back to their original characters.",
  category: "encoding",
  tags: ["html", "entities", "encode", "decode", "escape", "unescape"],
  keywords: ["html entities encoder decoder", "html escape unescape online"],
  icon: "Code",
  status: "new",
  component: () => import("@/tools/encoding/html-entities"),
  process: (input) => import("@/tools/encoding/html-entities/logic").then((m) => m.process(input)),
};
