import { quicktype, InputData, jsonInputForTargetLanguage } from "quicktype-core";

export interface CodegenInput {
  input: string;
  typeName?: string;
  lang: string;
}

export interface CodegenOutput {
  success: boolean;
  output?: string;
  error?: string;
}

export async function generateCode(params: CodegenInput): Promise<CodegenOutput> {
  const { input, typeName = "Root", lang } = params;
  if (!input?.trim()) return { success: false, error: "Input is empty" };
  try {
    JSON.parse(input);
  } catch (e) {
    return { success: false, error: `Invalid JSON: ${(e as Error).message}` };
  }
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const jsonInput = jsonInputForTargetLanguage(lang as any);
    await jsonInput.addSource({ name: typeName, samples: [input] });
    const inputData = new InputData();
    inputData.addInput(jsonInput);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await quicktype({ inputData, lang: lang as any, rendererOptions: {} });
    return { success: true, output: result.lines.join("\n") };
  } catch (e) {
    return { success: false, error: (e as Error).message };
  }
}

export function makeProcess(lang: string) {
  return (params: unknown): Promise<CodegenOutput> => {
    const { input, typeName } = params as CodegenInput;
    return generateCode({ input, typeName, lang });
  };
}
