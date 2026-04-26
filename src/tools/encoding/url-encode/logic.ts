export type UrlMode = "encode" | "decode";
export type UrlEncodeMode = "component" | "full";

export interface UrlEncodeInput {
  input: string;
  mode: UrlMode;
  encodeMode?: UrlEncodeMode;
}

export interface UrlEncodeOutput {
  success: boolean;
  output?: string;
  error?: string;
}

export function process(params: unknown): UrlEncodeOutput {
  const { input, mode, encodeMode = "component" } = params as UrlEncodeInput;
  if (!input?.trim()) return { success: false, error: "Input is empty" };
  try {
    if (mode === "encode") {
      const out =
        encodeMode === "component"
          ? encodeURIComponent(input)
          : encodeURI(input);
      return { success: true, output: out };
    } else {
      const out = input.includes("%") ? decodeURIComponent(input.trim()) : input;
      return { success: true, output: out };
    }
  } catch (e) {
    return { success: false, error: (e as Error).message };
  }
}
