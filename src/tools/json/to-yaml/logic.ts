import yaml from "js-yaml";

export interface ToYamlInput { input: string; indent?: number }
export interface ToYamlOutput { success: boolean; output?: string; error?: string }

export function process(params: unknown): ToYamlOutput {
  const { input, indent = 2 } = params as ToYamlInput;
  if (!input?.trim()) return { success: false, error: "Input is empty" };
  try {
    const parsed = JSON.parse(input);
    return { success: true, output: yaml.dump(parsed, { indent, lineWidth: -1 }) };
  } catch (e) {
    return { success: false, error: (e as Error).message };
  }
}
