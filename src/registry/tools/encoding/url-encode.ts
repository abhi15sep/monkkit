import type { ToolDefinition } from "@/types/registry";

export const urlEncodeTool: ToolDefinition = {
  id: "encoding-url-encode",
  slug: "url-encode",
  name: "URL Encode / Decode",
  shortDescription: "Percent-encode URLs or decode %xx sequences back to text.",
  description:
    "Encode strings for safe use in URLs using percent-encoding (encodeURIComponent or encodeURI), or decode %xx sequences back to readable text. Supports full Unicode including emoji.",
  category: "encoding",
  tags: ["url", "encode", "decode", "percent-encoding", "urlencode"],
  keywords: ["url encoder decoder online", "percent encode", "urlencode", "urldecode"],
  icon: "Link",
  status: "new",
  component: () => import("@/tools/encoding/url-encode"),
  process: (input) => import("@/tools/encoding/url-encode/logic").then((m) => m.process(input)),
};
