"use client";

import { useMemo, useState } from "react";
import Fuse from "fuse.js";
import { getAllTools } from "@/registry";
import type { ToolDefinition } from "@/types/registry";

const fuse = new Fuse(getAllTools(), {
  keys: ["name", "shortDescription", "tags"],
  threshold: 0.35,
});

export function useToolSearch() {
  const [query, setQuery] = useState("");

  const results: ToolDefinition[] = useMemo(() => {
    if (!query.trim()) return getAllTools();
    return fuse.search(query).map((r) => r.item);
  }, [query]);

  return { query, setQuery, results };
}
