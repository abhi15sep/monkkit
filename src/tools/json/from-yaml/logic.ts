import yaml from "js-yaml";

export interface FromYamlInput { input: string; indent?: number }
export interface FromYamlOutput { success: boolean; output?: string; error?: string }

export function process(params: unknown): FromYamlOutput {
  const { input, indent = 2 } = params as FromYamlInput;
  if (!input?.trim()) return { success: false, error: "Input is empty" };
  try {
    const parsed = yaml.load(input);
    return { success: true, output: JSON.stringify(parsed, null, indent) };
  } catch (e) {
    return { success: false, error: (e as Error).message };
  }
}
