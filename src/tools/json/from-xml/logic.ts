import { XMLParser } from "fast-xml-parser";

export interface FromXmlInput { input: string; indent?: number }
export interface FromXmlOutput { success: boolean; output?: string; error?: string }

export function process(params: unknown): FromXmlOutput {
  const { input, indent = 2 } = params as FromXmlInput;
  if (!input?.trim()) return { success: false, error: "Input is empty" };
  try {
    const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: "@_", parseAttributeValue: true, parseTagValue: true });
    const parsed = parser.parse(input) as unknown;
    return { success: true, output: JSON.stringify(parsed, null, indent) };
  } catch (e) {
    return { success: false, error: (e as Error).message };
  }
}
