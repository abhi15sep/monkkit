export interface EscapeInput {
  input: string;
}

export interface EscapeOutput {
  success: boolean;
  output?: string;
  error?: string;
}

export function process(params: unknown): EscapeOutput {
  const { input } = params as EscapeInput;
  if (!input?.trim()) return { success: false, error: "Input is empty" };
  try {
    // JSON.stringify wraps in quotes and escapes all special chars; strip outer quotes
    const escaped = JSON.stringify(input).slice(1, -1);
    return { success: true, output: escaped };
  } catch (e) {
    return { success: false, error: (e as Error).message };
  }
}
