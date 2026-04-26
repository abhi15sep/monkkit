export type Base64Mode = "encode" | "decode";

export interface Base64Input {
  input: string;
  mode: Base64Mode;
  urlSafe?: boolean;
}

export interface Base64Output {
  success: boolean;
  output?: string;
  error?: string;
}

export function process(params: unknown): Base64Output {
  const { input, mode, urlSafe = false } = params as Base64Input;
  if (!input?.trim()) return { success: false, error: "Input is empty" };
  try {
    if (mode === "encode") {
      const encoded = btoa(unescape(encodeURIComponent(input)));
      const out = urlSafe
        ? encoded.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "")
        : encoded;
      return { success: true, output: out };
    } else {
      const normalized = urlSafe
        ? input.replace(/-/g, "+").replace(/_/g, "/").padEnd(input.length + ((4 - (input.length % 4)) % 4), "=")
        : input;
      const decoded = decodeURIComponent(escape(atob(normalized.trim())));
      return { success: true, output: decoded };
    }
  } catch (e) {
    return { success: false, error: (e as Error).message };
  }
}
