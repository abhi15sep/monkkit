export interface SizeInput {
  input: string;
}

export interface TypeCount {
  string: number;
  number: number;
  boolean: number;
  null: number;
  object: number;
  array: number;
}

export interface SizeOutput {
  success: boolean;
  error?: string;
  byteSize?: number;
  minifiedSize?: number;
  keyCount?: number;
  valueCount?: number;
  depth?: number;
  types?: TypeCount;
  arrayLengths?: number[];
}

function analyze(
  val: unknown,
  depth: number,
  stats: { keys: number; values: number; maxDepth: number; types: TypeCount; arrayLengths: number[] }
): void {
  if (depth > stats.maxDepth) stats.maxDepth = depth;

  if (val === null) { stats.types.null++; stats.values++; }
  else if (typeof val === "string") { stats.types.string++; stats.values++; }
  else if (typeof val === "number") { stats.types.number++; stats.values++; }
  else if (typeof val === "boolean") { stats.types.boolean++; stats.values++; }
  else if (Array.isArray(val)) {
    stats.types.array++;
    stats.arrayLengths.push(val.length);
    val.forEach((v) => analyze(v, depth + 1, stats));
  } else if (typeof val === "object") {
    stats.types.object++;
    const keys = Object.keys(val as object);
    stats.keys += keys.length;
    keys.forEach((k) => { void k; analyze((val as Record<string, unknown>)[k], depth + 1, stats); });
  }
}

export function process(params: unknown): SizeOutput {
  const { input } = params as SizeInput;
  if (!input?.trim()) return { success: false, error: "Input is empty" };
  try {
    const parsed = JSON.parse(input);
    const stats = { keys: 0, values: 0, maxDepth: 0, types: { string: 0, number: 0, boolean: 0, null: 0, object: 0, array: 0 }, arrayLengths: [] as number[] };
    analyze(parsed, 0, stats);
    const minified = JSON.stringify(parsed);
    return {
      success: true,
      byteSize: new TextEncoder().encode(input).length,
      minifiedSize: new TextEncoder().encode(minified).length,
      keyCount: stats.keys,
      valueCount: stats.values,
      depth: stats.maxDepth,
      types: stats.types,
      arrayLengths: stats.arrayLengths,
    };
  } catch (e) {
    return { success: false, error: `Invalid JSON: ${(e as Error).message}` };
  }
}
