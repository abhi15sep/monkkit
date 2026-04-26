import Papa from "papaparse";

export interface FromCsvInput { input: string; header?: boolean }
export interface FromCsvOutput { success: boolean; output?: string; error?: string; rowCount?: number }

export function process(params: unknown): FromCsvOutput {
  const { input, header = true } = params as FromCsvInput;
  if (!input?.trim()) return { success: false, error: "Input is empty" };
  try {
    const result = Papa.parse(input, { header, skipEmptyLines: true, dynamicTyping: true });
    if (result.errors.length > 0) {
      return { success: false, error: result.errors[0].message };
    }
    return { success: true, output: JSON.stringify(result.data, null, 2), rowCount: result.data.length };
  } catch (e) {
    return { success: false, error: (e as Error).message };
  }
}
