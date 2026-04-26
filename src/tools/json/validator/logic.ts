export interface ValidatorInput {
  input: string;
  indent?: number;
}

export interface ValidatorOutput {
  valid: boolean;
  formatted?: string;
  error?: { message: string; line?: number; column?: number };
}

export function process(params: unknown): ValidatorOutput {
  const { input, indent = 2 } = params as ValidatorInput;
  if (!input?.trim()) return { valid: false, error: { message: "Input is empty" } };
  try {
    const parsed = JSON.parse(input);
    return { valid: true, formatted: JSON.stringify(parsed, null, indent) };
  } catch (e) {
    const msg = (e as SyntaxError).message;
    const match = msg.match(/position (\d+)/);
    if (match) {
      const pos = parseInt(match[1]);
      const before = input.slice(0, pos);
      const line = before.split("\n").length;
      const col = pos - before.lastIndexOf("\n");
      return { valid: false, error: { message: msg, line, column: col } };
    }
    return { valid: false, error: { message: msg } };
  }
}
