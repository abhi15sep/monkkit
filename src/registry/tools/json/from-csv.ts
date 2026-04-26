import type { ToolDefinition } from "@/types/registry";
import { process } from "@/tools/json/from-csv/logic";

export const csvToJsonTool: ToolDefinition = {
  id: "json-from-csv", slug: "from-csv", name: "CSV → JSON",
  shortDescription: "Parse CSV and convert each row to a JSON object.",
  description: "Parse any CSV file into a JSON array of objects. Auto-detects delimiters, parses numbers and booleans, and handles quoted fields with commas.",
  category: "json", tags: ["csv", "convert", "import", "spreadsheet"], keywords: ["csv to json", "convert csv to json online"],
  icon: "Table", status: "new",
  component: () => import("@/tools/json/from-csv"), process,
};
