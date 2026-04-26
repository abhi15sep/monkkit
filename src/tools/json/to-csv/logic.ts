import Papa from "papaparse";

export interface ToCsvInput { input: string; delimiter?: string }
export interface ToCsvOutput { success: boolean; output?: string; error?: string; rowCount?: number }

export function process(params: unknown): ToCsvOutput {
  const { input, delimiter = "," } = params as ToCsvInput;
  if (!input?.trim()) return { success: false, error: "Input is empty" };
  try {
    const parsed = JSON.parse(input);
    const arr = Array.isArray(parsed) ? parsed : [parsed];
    if (arr.some((r) => typeof r !== "object" || r === null || Array.isArray(r))) {
      return { success: false, error: "Input must be a JSON array of objects (or a single object)" };
    }
    const output = Papa.unparse(arr, { delimiter });
    return { success: true, output, rowCount: arr.length };
  } catch (e) {
    return { success: false, error: (e as Error).message };
  }
}
