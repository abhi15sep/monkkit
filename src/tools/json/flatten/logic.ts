export interface FlattenInput {
  input: string;
  delimiter?: string;
}

export interface FlattenOutput {
  success: boolean;
  output?: string;
  error?: string;
}

function flattenObj(obj: unknown, prefix = "", delimiter = "."): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  if (obj === null || typeof obj !== "object") {
    result[prefix] = obj;
    return result;
  }
  if (Array.isArray(obj)) {
    if (obj.length === 0) { result[prefix] = obj; return result; }
    obj.forEach((v, i) => {
      Object.assign(result, flattenObj(v, prefix ? `${prefix}[${i}]` : `[${i}]`, delimiter));
    });
  } else {
    const keys = Object.keys(obj as object);
    if (keys.length === 0) { result[prefix] = obj; return result; }
    keys.forEach((k) => {
      const newKey = prefix ? `${prefix}${delimiter}${k}` : k;
      Object.assign(result, flattenObj((obj as Record<string, unknown>)[k], newKey, delimiter));
    });
  }
  return result;
}

export function process(params: unknown): FlattenOutput {
  const { input, delimiter = "." } = params as FlattenInput;
  if (!input?.trim()) return { success: false, error: "Input is empty" };
  try {
    const parsed = JSON.parse(input);
    const flat = flattenObj(parsed, "", delimiter);
    return { success: true, output: JSON.stringify(flat, null, 2) };
  } catch (e) {
    return { success: false, error: `Invalid JSON: ${(e as Error).message}` };
  }
}
