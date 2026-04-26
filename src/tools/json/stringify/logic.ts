export interface StringifyInput {
  input: string;
  indent?: number;
}

export interface StringifyOutput {
  success: boolean;
  output?: string;
  error?: string;
}

// Converts a JS object literal string to a valid JSON string (double-quotes keys, removes trailing commas, etc.)
// Strategy: use Function() to evaluate the JS object, then JSON.stringify it.
export function process(params: unknown): StringifyOutput {
  const { input, indent = 2 } = params as StringifyInput;
  if (!input?.trim()) return { success: false, error: "Input is empty" };
  try {
    // eslint-disable-next-line no-new-func
    const value = new Function(`"use strict"; return (${input})`)();
    const output = JSON.stringify(value, null, indent);
    return { success: true, output };
  } catch (e) {
    return { success: false, error: `Could not evaluate as JavaScript: ${(e as Error).message}` };
  }
}
