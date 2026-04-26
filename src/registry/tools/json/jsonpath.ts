import type { ToolDefinition } from "@/types/registry";
import { process } from "@/tools/json/jsonpath/logic";

export const jsonPathTool: ToolDefinition = {
  id: "json-jsonpath",
  slug: "jsonpath",
  name: "JSONPath Query",
  shortDescription: "Run JSONPath expressions to extract data from JSON.",
  description:
    "Query JSON using JSONPath expressions like $.store.books[*].title. Supports filters, wildcards, recursive descent, and array slices. Powered by jsonpath-plus.",
  category: "json",
  tags: ["jsonpath", "query", "extract", "filter"],
  keywords: ["jsonpath online", "json query tool", "jsonpath tester", "extract json data"],
  icon: "Search",
  status: "new",
  component: () => import("@/tools/json/jsonpath"),
  process,
};
