import { XMLBuilder } from "fast-xml-parser";

export interface ToXmlInput { input: string; rootTag?: string; indent?: number }
export interface ToXmlOutput { success: boolean; output?: string; error?: string }

export function process(params: unknown): ToXmlOutput {
  const { input, rootTag = "root", indent = 2 } = params as ToXmlInput;
  if (!input?.trim()) return { success: false, error: "Input is empty" };
  try {
    const parsed = JSON.parse(input);
    const builder = new XMLBuilder({ indentBy: " ".repeat(indent), format: true, ignoreAttributes: false });
    const wrapped = { [rootTag]: parsed };
    const output = builder.build(wrapped) as string;
    return { success: true, output: `<?xml version="1.0" encoding="UTF-8"?>\n${output}` };
  } catch (e) {
    return { success: false, error: (e as Error).message };
  }
}
