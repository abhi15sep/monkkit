import type { ToolDefinition } from "@/types/registry";

export const hashTool: ToolDefinition = {
  id: "encoding-hash",
  slug: "hash",
  name: "Hash Generator",
  shortDescription: "Generate MD5, SHA-1, SHA-256, SHA-384, and SHA-512 hashes.",
  description:
    "Generate cryptographic hashes from any text input. Produces MD5, SHA-1, SHA-256, SHA-384, and SHA-512 digests all at once. Runs entirely in your browser — your data never leaves the page.",
  category: "encoding",
  tags: ["hash", "md5", "sha256", "sha512", "sha1", "checksum", "digest"],
  keywords: ["hash generator online", "md5 sha256 hash", "checksum generator"],
  icon: "Fingerprint",
  status: "new",
  component: () => import("@/tools/encoding/hash"),
  process: (input) => import("@/tools/encoding/hash/logic").then((m) => m.process(input)),
};
