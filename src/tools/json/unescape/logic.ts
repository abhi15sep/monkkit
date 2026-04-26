export interface UnescapeInput {
  input: string;
}

export interface UnescapeOutput {
  success: boolean;
  output?: string;
  error?: string;
}

export function process(params: unknown): UnescapeOutput {
  const { input } = params as UnescapeInput;
  if (!input?.trim()) return { success: false, error: "Input is empty" };
  try {
    // Wrap in quotes so JSON.parse can unescape it
    const unescaped = JSON.parse(`"${input}"`);
    return { success: true, output: unescaped };
  } catch (e) {
    return { success: false, error: `Invalid escaped string: ${(e as Error).message}` };
  }
}
