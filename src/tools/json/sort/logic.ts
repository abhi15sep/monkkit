export interface SortInput {
  input: string;
  indent?: number;
  direction?: "asc" | "desc";
}

export interface SortOutput {
  success: boolean;
  output?: string;
  error?: string;
}

function sortDeep(value: unknown, direction: "asc" | "desc"): unknown {
  if (Array.isArray(value)) return value.map((v) => sortDeep(v, direction));
  if (value !== null && typeof value === "object") {
    const keys = Object.keys(value as object).sort((a, b) =>
      direction === "asc" ? a.localeCompare(b) : b.localeCompare(a)
    );
    const sorted: Record<string, unknown> = {};
    for (const k of keys) sorted[k] = sortDeep((value as Record<string, unknown>)[k], direction);
    return sorted;
  }
  return value;
}

export function process(params: unknown): SortOutput {
  const { input, indent = 2, direction = "asc" } = params as SortInput;
  if (!input?.trim()) return { success: false, error: "Input is empty" };
  try {
    const parsed = JSON.parse(input);
    const sorted = sortDeep(parsed, direction);
    return { success: true, output: JSON.stringify(sorted, null, indent) };
  } catch (e) {
    return { success: false, error: `Invalid JSON: ${(e as Error).message}` };
  }
}
