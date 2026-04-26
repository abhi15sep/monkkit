import { jsonrepair } from "jsonrepair";

export interface RepairInput {
  input: string;
}

export interface RepairOutput {
  success: boolean;
  output?: string;
  error?: string;
  wasAlreadyValid?: boolean;
}

export function process(params: unknown): RepairOutput {
  const { input } = params as RepairInput;
  if (!input?.trim()) return { success: false, error: "Input is empty" };
  try {
    // Check if already valid
    try {
      JSON.parse(input);
      const repaired = jsonrepair(input);
      return { success: true, output: repaired, wasAlreadyValid: true };
    } catch {
      // needs repair
    }
    const repaired = jsonrepair(input);
    return { success: true, output: repaired, wasAlreadyValid: false };
  } catch (e) {
    return { success: false, error: (e as Error).message };
  }
}
