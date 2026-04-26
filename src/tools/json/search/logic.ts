export interface SearchInput {
  input: string;
  query: string;
  searchIn?: "keys" | "values" | "both";
  caseSensitive?: boolean;
}

export interface SearchMatch {
  path: string;
  key: string;
  value: unknown;
  matchedOn: "key" | "value";
}

export interface SearchOutput {
  success: boolean;
  matches?: SearchMatch[];
  count?: number;
  error?: string;
}

function searchDeep(
  val: unknown,
  query: string,
  searchIn: "keys" | "values" | "both",
  caseSensitive: boolean,
  path: string,
  matches: SearchMatch[]
): void {
  const normalize = (s: string) => caseSensitive ? s : s.toLowerCase();
  const q = normalize(query);

  if (typeof val === "object" && val !== null && !Array.isArray(val)) {
    for (const [k, v] of Object.entries(val as Record<string, unknown>)) {
      const childPath = path ? `${path}.${k}` : k;
      if ((searchIn === "keys" || searchIn === "both") && normalize(k).includes(q)) {
        matches.push({ path: childPath, key: k, value: v, matchedOn: "key" });
      }
      if ((searchIn === "values" || searchIn === "both") && (typeof v === "string" || typeof v === "number" || typeof v === "boolean") && normalize(String(v)).includes(q)) {
        matches.push({ path: childPath, key: k, value: v, matchedOn: "value" });
      }
      searchDeep(v, query, searchIn, caseSensitive, childPath, matches);
    }
  } else if (Array.isArray(val)) {
    val.forEach((v, i) => searchDeep(v, query, searchIn, caseSensitive, `${path}[${i}]`, matches));
  }
}

export function process(params: unknown): SearchOutput {
  const { input, query, searchIn = "both", caseSensitive = false } = params as SearchInput;
  if (!input?.trim()) return { success: false, error: "Input is empty" };
  if (!query?.trim()) return { success: false, error: "Search query is empty" };
  try {
    const parsed = JSON.parse(input);
    const matches: SearchMatch[] = [];
    searchDeep(parsed, query, searchIn, caseSensitive, "", matches);
    return { success: true, matches, count: matches.length };
  } catch (e) {
    return { success: false, error: `Invalid JSON: ${(e as Error).message}` };
  }
}
