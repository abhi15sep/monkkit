"use client";

import { useState } from "react";

export function useToolInput(toolId: string, defaultValue = "") {
  const key = `tool-input:${toolId}`;
  const [value, setRaw] = useState(() => {
    if (typeof window === "undefined") return defaultValue;
    return localStorage.getItem(key) ?? defaultValue;
  });

  const setValue = (v: string) => {
    if (typeof window !== "undefined") localStorage.setItem(key, v);
    setRaw(v);
  };

  return [value, setValue] as const;
}
