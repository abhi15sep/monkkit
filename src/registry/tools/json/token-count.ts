import type { ToolDefinition } from "@/types/registry";
import { process } from "@/tools/json/token-count/logic";
export const jsonTokenCountTool: ToolDefinition = {
  id: "json-token-count", slug: "token-count", name: "JSON Token Counter",
  shortDescription: "Count GPT tokens in any JSON or text (cl100k_base encoding).",
  description: "Count how many tokens your JSON or text will consume for GPT-4, GPT-4o, or GPT-3.5-turbo. Uses cl100k_base encoding via gpt-tokenizer. Shows token count, character count, byte size, and chars-per-token ratio.",
  category: "json", tags: ["tokens", "openai", "gpt", "llm"], keywords: ["token counter online", "count gpt tokens", "json token count openai"],
  icon: "Hash", status: "new",
  component: () => import("@/tools/json/token-count"), process,
};
