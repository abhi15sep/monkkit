import { JSONPath } from "jsonpath-plus";

export interface JsonPathInput {
  input: string;
  path: string;
}

export interface JsonPathOutput {
  success: boolean;
  results?: unknown[];
  output?: string;
  count?: number;
  error?: string;
}

export function process(params: unknown): JsonPathOutput {
  const { input, path } = params as JsonPathInput;
  if (!input?.trim()) return { success: false, error: "Input is empty" };
  if (!path?.trim()) return { success: false, error: "JSONPath expression is empty" };

  let parsed: unknown;
  try { parsed = JSON.parse(input); } catch (e) { return { success: false, error: `Invalid JSON: ${(e as Error).message}` }; }

  try {
    const results = JSONPath({ path, json: parsed as object });
    return {
      success: true,
      results,
      output: JSON.stringify(results, null, 2),
      count: results.length,
    };
  } catch (e) {
    return { success: false, error: `Invalid JSONPath expression: ${(e as Error).message}` };
  }
}
