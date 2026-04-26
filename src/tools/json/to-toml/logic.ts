import { stringify } from "smol-toml";

export interface ToTomlInput { input: string }
export interface ToTomlOutput { success: boolean; output?: string; error?: string }

export function process(params: unknown): ToTomlOutput {
  const { input } = params as ToTomlInput;
  if (!input?.trim()) return { success: false, error: "Input is empty" };
  try {
    const parsed = JSON.parse(input) as Record<string, unknown>;
    if (typeof parsed !== "object" || Array.isArray(parsed) || parsed === null) {
      return { success: false, error: "TOML requires a top-level object (not an array)" };
    }
    return { success: true, output: stringify(parsed) };
  } catch (e) {
    return { success: false, error: (e as Error).message };
  }
}
