export interface UnflattenInput {
  input: string;
  delimiter?: string;
}

export interface UnflattenOutput {
  success: boolean;
  output?: string;
  error?: string;
}

function setDeep(obj: Record<string, unknown>, keys: string[], value: unknown): void {
  let cur: Record<string, unknown> = obj;
  for (let i = 0; i < keys.length - 1; i++) {
    const k = keys[i];
    if (cur[k] === undefined || cur[k] === null || typeof cur[k] !== "object") {
      cur[k] = {};
    }
    cur = cur[k] as Record<string, unknown>;
  }
  cur[keys[keys.length - 1]] = value;
}

export function process(params: unknown): UnflattenOutput {
  const { input, delimiter = "." } = params as UnflattenInput;
  if (!input?.trim()) return { success: false, error: "Input is empty" };
  try {
    const flat = JSON.parse(input) as Record<string, unknown>;
    if (typeof flat !== "object" || Array.isArray(flat) || flat === null) {
      return { success: false, error: "Input must be a flat JSON object (key-value pairs)" };
    }
    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(flat)) {
      const keys = key.split(delimiter);
      setDeep(result, keys, value);
    }
    return { success: true, output: JSON.stringify(result, null, 2) };
  } catch (e) {
    return { success: false, error: `Invalid JSON: ${(e as Error).message}` };
  }
}
