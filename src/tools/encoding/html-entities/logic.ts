export type HtmlMode = "encode" | "decode";

export interface HtmlEntitiesInput {
  input: string;
  mode: HtmlMode;
}

export interface HtmlEntitiesOutput {
  success: boolean;
  output?: string;
  error?: string;
}

const ENCODE_MAP: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

const DECODE_MAP: Record<string, string> = {
  "&amp;": "&",
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&#39;": "'",
  "&apos;": "'",
  "&nbsp;": " ",
  "&copy;": "©",
  "&reg;": "®",
  "&trade;": "™",
  "&euro;": "€",
  "&pound;": "£",
  "&yen;": "¥",
  "&cent;": "¢",
  "&mdash;": "—",
  "&ndash;": "–",
  "&hellip;": "…",
};

export function process(params: unknown): HtmlEntitiesOutput {
  const { input, mode } = params as HtmlEntitiesInput;
  if (!input?.trim()) return { success: false, error: "Input is empty" };
  try {
    if (mode === "encode") {
      const out = input.replace(/[&<>"']/g, (c) => ENCODE_MAP[c] ?? c);
      return { success: true, output: out };
    } else {
      // decode named entities and numeric entities (&#123; and &#x7b;)
      const out = input
        .replace(/&[a-zA-Z]+;/g, (e) => DECODE_MAP[e] ?? e)
        .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
        .replace(/&#x([0-9a-fA-F]+);/g, (_, h) => String.fromCharCode(parseInt(h, 16)));
      return { success: true, output: out };
    }
  } catch (e) {
    return { success: false, error: (e as Error).message };
  }
}
