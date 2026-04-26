import type { ToolDefinition } from "@/types/registry";
import { process } from "@/tools/json/to-csv/logic";

export const jsonToCsvTool: ToolDefinition = {
  id: "json-to-csv", slug: "to-csv", name: "JSON → CSV",
  shortDescription: "Convert a JSON array of objects to CSV rows.",
  description: "Flatten a JSON array of objects into CSV format. Choose comma, semicolon, or tab as delimiter. All object keys become column headers.",
  category: "json", tags: ["csv", "convert", "export", "spreadsheet"], keywords: ["json to csv", "convert json to csv online"],
  icon: "Table", status: "new",
  component: () => import("@/tools/json/to-csv"), process,
};
