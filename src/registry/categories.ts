import type { ToolCategory } from "@/types/registry";

export const CATEGORIES: ToolCategory[] = [
  {
    id: "json",
    name: "JSON Tools",
    description: "Validate, format, convert, and transform JSON data",
    icon: "Braces",
    color: "amber",
    slug: "json",
    order: 1,
  },
  // Future categories — add here as you build them
  // { id: "encoding", name: "Encoding", description: "...", icon: "Lock", color: "blue", slug: "encoding", order: 2 },
  // { id: "certificates", name: "Certificates", description: "...", icon: "ShieldCheck", color: "green", slug: "certificates", order: 3 },
];
