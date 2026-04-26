import type { ToolDefinition } from "@/types/registry";

export const base64Tool: ToolDefinition = {
  id: "encoding-base64",
  slug: "base64",
  name: "Base64 Encode / Decode",
  shortDescription: "Encode text to Base64 or decode Base64 back to text.",
  description:
    "Encode plain text or binary data to Base64, or decode Base64 strings back to readable text. Supports standard and URL-safe Base64 (RFC 4648). Handles Unicode and emoji correctly.",
  category: "encoding",
  tags: ["base64", "encode", "decode", "binary", "encoding"],
  keywords: ["base64 encoder decoder online", "base64 encode", "base64 decode"],
  icon: "Binary",
  status: "new",
  component: () => import("@/tools/encoding/base64"),
  process: (input) => import("@/tools/encoding/base64/logic").then((m) => m.process(input)),
};
