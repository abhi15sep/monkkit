export interface DiffInput {
  left: string;
  right: string;
}

export type DiffChangeType = "added" | "removed" | "changed" | "unchanged";

export interface DiffLine {
  type: DiffChangeType;
  path: string;
  leftValue?: unknown;
  rightValue?: unknown;
}

export interface DiffOutput {
  success: boolean;
  lines?: DiffLine[];
  error?: string;
  addedCount: number;
  removedCount: number;
  changedCount: number;
}

function flattenPaths(obj: unknown, prefix = ""): Map<string, unknown> {
  const map = new Map<string, unknown>();
  if (obj === null || typeof obj !== "object") {
    map.set(prefix || ".", obj);
    return map;
  }
  if (Array.isArray(obj)) {
    if (obj.length === 0) { map.set(prefix, obj); return map; }
    obj.forEach((v, i) => {
      flattenPaths(v, `${prefix}[${i}]`).forEach((val, k) => map.set(k, val));
    });
  } else {
    const keys = Object.keys(obj as object);
    if (keys.length === 0) { map.set(prefix, obj); return map; }
    keys.forEach((k) => {
      const newKey = prefix ? `${prefix}.${k}` : k;
      flattenPaths((obj as Record<string, unknown>)[k], newKey).forEach((val, p) => map.set(p, val));
    });
  }
  return map;
}

export function process(params: unknown): DiffOutput {
  const { left, right } = params as DiffInput;
  if (!left?.trim() || !right?.trim()) return { success: false, error: "Both inputs are required", addedCount: 0, removedCount: 0, changedCount: 0 };
  let parsedLeft: unknown, parsedRight: unknown;
  try { parsedLeft = JSON.parse(left); } catch (e) { return { success: false, error: `Left JSON: ${(e as Error).message}`, addedCount: 0, removedCount: 0, changedCount: 0 }; }
  try { parsedRight = JSON.parse(right); } catch (e) { return { success: false, error: `Right JSON: ${(e as Error).message}`, addedCount: 0, removedCount: 0, changedCount: 0 }; }

  const leftMap = flattenPaths(parsedLeft);
  const rightMap = flattenPaths(parsedRight);
  const allKeys = new Set([...leftMap.keys(), ...rightMap.keys()]);

  const lines: DiffLine[] = [];
  let addedCount = 0, removedCount = 0, changedCount = 0;

  Array.from(allKeys).sort().forEach((path) => {
    const hasLeft = leftMap.has(path);
    const hasRight = rightMap.has(path);
    const lv = leftMap.get(path);
    const rv = rightMap.get(path);

    if (hasLeft && !hasRight) {
      lines.push({ type: "removed", path, leftValue: lv });
      removedCount++;
    } else if (!hasLeft && hasRight) {
      lines.push({ type: "added", path, rightValue: rv });
      addedCount++;
    } else if (JSON.stringify(lv) !== JSON.stringify(rv)) {
      lines.push({ type: "changed", path, leftValue: lv, rightValue: rv });
      changedCount++;
    } else {
      lines.push({ type: "unchanged", path, leftValue: lv });
    }
  });

  return { success: true, lines, addedCount, removedCount, changedCount };
}
