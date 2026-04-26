export interface MinifyInput {
  input: string;
}

export interface MinifyOutput {
  success: boolean;
  output?: string;
  originalSize?: number;
  minifiedSize?: number;
  savings?: number;
  error?: string;
}

export function process(params: unknown): MinifyOutput {
  const { input } = params as MinifyInput;
  if (!input?.trim()) return { success: false, error: "Input is empty" };
  try {
    const minified = JSON.stringify(JSON.parse(input));
    const originalSize = new TextEncoder().encode(input).length;
    const minifiedSize = new TextEncoder().encode(minified).length;
    return {
      success: true,
      output: minified,
      originalSize,
      minifiedSize,
      savings: Math.round((1 - minifiedSize / originalSize) * 100),
    };
  } catch (e) {
    return { success: false, error: (e as SyntaxError).message };
  }
}
