import type { ToolDefinition } from "@/types/registry";
import { process } from "@/tools/json/to-rust/logic";
export const jsonToRustTool: ToolDefinition = {
  id: "json-to-rust", slug: "to-rust", name: "JSON → Rust",
  shortDescription: "Generate Rust structs with Serde from JSON.",
  description: "Generate Rust structs with serde::Deserialize and serde::Serialize derives from any JSON sample using quicktype.",
  category: "json", tags: ["rust", "serde", "codegen", "struct"], keywords: ["json to rust struct", "generate rust struct from json"],
  icon: "FileCode2", status: "new",
  component: () => import("@/tools/json/to-rust"), process,
};
