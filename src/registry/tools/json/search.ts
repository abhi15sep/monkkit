import type { ToolDefinition } from "@/types/registry";
import { process } from "@/tools/json/search/logic";

export const jsonSearchTool: ToolDefinition = {
  id: "json-search",
  slug: "search",
  name: "JSON Search",
  shortDescription: "Search for keys or values anywhere in a JSON document.",
  description:
    "Find any key or value in a JSON document by typing a search term. Results show the full dot-notation path, whether the match was on a key or value, and the matched data. Toggle between searching keys, values, or both.",
  category: "json",
  tags: ["search", "find", "query", "filter"],
  keywords: ["json search online", "find value in json", "json key search", "search json tree"],
  icon: "TextSearch",
  status: "new",
  component: () => import("@/tools/json/search"),
  process,
};
