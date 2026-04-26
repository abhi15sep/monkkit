export interface ToSqlInput { input: string; tableName?: string; dialect?: "mysql" | "postgres" | "sqlite" }
export interface ToSqlOutput { success: boolean; output?: string; error?: string; rowCount?: number }

function quote(dialect: string, name: string): string {
  if (dialect === "mysql") return `\`${name}\``;
  return `"${name}"`;
}

function sqlValue(val: unknown): string {
  if (val === null || val === undefined) return "NULL";
  if (typeof val === "boolean") return val ? "TRUE" : "FALSE";
  if (typeof val === "number") return String(val);
  if (typeof val === "object") return `'${JSON.stringify(val).replace(/'/g, "''")}'`;
  return `'${String(val).replace(/'/g, "''")}'`;
}

export function process(params: unknown): ToSqlOutput {
  const { input, tableName = "my_table", dialect = "postgres" } = params as ToSqlInput;
  if (!input?.trim()) return { success: false, error: "Input is empty" };
  try {
    const parsed = JSON.parse(input);
    const arr: Record<string, unknown>[] = Array.isArray(parsed) ? parsed : [parsed];
    if (arr.some((r) => typeof r !== "object" || r === null || Array.isArray(r))) {
      return { success: false, error: "Input must be a JSON array of objects (or a single object)" };
    }

    const q = (n: string) => quote(dialect, n);
    const allKeys = Array.from(new Set(arr.flatMap((r) => Object.keys(r))));
    const table = q(tableName);
    const cols = allKeys.map(q).join(", ");

    const rows = arr.map((row) => {
      const vals = allKeys.map((k) => sqlValue(row[k])).join(", ");
      return `INSERT INTO ${table} (${cols}) VALUES (${vals});`;
    });

    return { success: true, output: rows.join("\n"), rowCount: arr.length };
  } catch (e) {
    return { success: false, error: (e as Error).message };
  }
}
