export interface FormatterInput {
  input: string;
  indent?: number;
  sortKeys?: boolean;
}

export interface FormatterOutput {
  success: boolean;
  output?: string;
  error?: string;
}

function sortObjectKeys(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(sortObjectKeys);
  if (value !== null && typeof value === "object") {
    return Object.fromEntries(
      Object.keys(value as object)
        .sort()
        .map((k) => [k, sortObjectKeys((value as Record<string, unknown>)[k])])
    );
  }
  return value;
}

export function process(params: unknown): FormatterOutput {
  const { input, indent = 2, sortKeys = false } = params as FormatterInput;
  if (!input?.trim()) return { success: false, error: "Input is empty" };
  try {
    let parsed = JSON.parse(input);
    if (sortKeys) parsed = sortObjectKeys(parsed);
    return { success: true, output: JSON.stringify(parsed, null, indent) };
  } catch (e) {
    return { success: false, error: (e as SyntaxError).message };
  }
}
