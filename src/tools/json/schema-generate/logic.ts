export interface SchemaGenerateInput {
  input: string;
  title?: string;
  draft?: "draft-07" | "2019-09" | "2020-12";
}

export interface SchemaGenerateOutput {
  success: boolean;
  output?: string;
  error?: string;
}

function inferSchema(value: unknown, title?: string): object {
  if (value === null) return { type: "null" };
  if (typeof value === "boolean") return { type: "boolean" };
  if (typeof value === "number") {
    return Number.isInteger(value) ? { type: "integer" } : { type: "number" };
  }
  if (typeof value === "string") return { type: "string" };
  if (Array.isArray(value)) {
    if (value.length === 0) return { type: "array", items: {} };
    // Merge schemas of all items
    const itemSchemas = value.map((v) => inferSchema(v));
    const merged = mergeSchemas(itemSchemas);
    return { type: "array", items: merged };
  }
  if (typeof value === "object") {
    const obj = value as Record<string, unknown>;
    const properties: Record<string, object> = {};
    const required: string[] = [];
    for (const [k, v] of Object.entries(obj)) {
      properties[k] = inferSchema(v);
      required.push(k);
    }
    const schema: Record<string, unknown> = { type: "object", properties };
    if (required.length > 0) schema.required = required;
    schema.additionalProperties = false;
    if (title) schema.title = title;
    return schema as object;
  }
  return {};
}

function mergeSchemas(schemas: object[]): object {
  const types = new Set(schemas.map((s) => (s as Record<string, unknown>).type));
  if (types.size === 1) return schemas[0];
  return { oneOf: schemas };
}

export function process(params: unknown): SchemaGenerateOutput {
  const { input, title = "Root", draft = "draft-07" } = params as SchemaGenerateInput;
  if (!input?.trim()) return { success: false, error: "Input is empty" };
  try {
    const parsed = JSON.parse(input);
    const schema = inferSchema(parsed, title);
    const schemaUri: Record<string, string> = {
      "draft-07": "http://json-schema.org/draft-07/schema#",
      "2019-09": "https://json-schema.org/draft/2019-09/schema",
      "2020-12": "https://json-schema.org/draft/2020-12/schema",
    };
    const full = { $schema: schemaUri[draft], ...schema };
    return { success: true, output: JSON.stringify(full, null, 2) };
  } catch (e) {
    return { success: false, error: `Invalid JSON: ${(e as Error).message}` };
  }
}
