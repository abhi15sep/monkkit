import type { ToolDefinition } from "@/types/registry";
import { process } from "@/tools/json/to-sql/logic";

export const jsonToSqlTool: ToolDefinition = {
  id: "json-to-sql", slug: "to-sql", name: "JSON → SQL",
  shortDescription: "Generate SQL INSERT statements from a JSON array.",
  description: "Convert a JSON array of objects into SQL INSERT statements. Choose your dialect (PostgreSQL, MySQL, SQLite) and set the target table name.",
  category: "json", tags: ["sql", "convert", "database", "insert"], keywords: ["json to sql", "json to insert statement", "convert json to sql"],
  icon: "Database", status: "new",
  component: () => import("@/tools/json/to-sql"), process,
};
