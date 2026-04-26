import { encode } from "gpt-tokenizer";

export interface TokenCountInput {
  input: string;
  model?: "gpt-4" | "gpt-3.5-turbo" | "gpt-4o";
}

export interface TokenCountOutput {
  success: boolean;
  tokenCount?: number;
  charCount?: number;
  byteCount?: number;
  ratio?: number;
  error?: string;
}

export function process(params: unknown): TokenCountOutput {
  const { input } = params as TokenCountInput;
  if (!input?.trim()) return { success: false, error: "Input is empty" };
  try {
    // gpt-tokenizer uses cl100k_base (same encoding for gpt-4, gpt-3.5-turbo, gpt-4o)
    const tokens = encode(input);
    const charCount = input.length;
    const byteCount = new TextEncoder().encode(input).length;
    return {
      success: true,
      tokenCount: tokens.length,
      charCount,
      byteCount,
      ratio: Math.round((charCount / tokens.length) * 10) / 10,
    };
  } catch (e) {
    return { success: false, error: (e as Error).message };
  }
}
