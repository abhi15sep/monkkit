"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { registry } from "@/registry";
import { Badge } from "@/components/ui/badge";

export default function ToolsPage() {
  const [open, setOpen] = useState<Record<string, boolean>>({});

  const toggle = (id: string) =>
    setOpen((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <div className="p-4 lg:p-6 max-w-5xl">
      <h1 className="text-2xl font-bold mb-6">All Tools</h1>

      <div className="flex flex-col gap-3">
        {registry.categories.map((category) => {
          const tools = registry.tools.filter((t) => t.category === category.id);
          if (!tools.length) return null;
          const isOpen = open[category.id] ?? false;

          return (
            <div key={category.id} className="rounded-xl border border-border/50 overflow-hidden">
              {/* Category header — click to toggle */}
              <button
                onClick={() => toggle(category.id)}
                className="w-full flex items-center justify-between gap-3 px-5 py-4 bg-card hover:bg-muted/40 transition-colors text-left"
              >
                <div className="flex items-center gap-3">
                  <span className="font-semibold">{category.name}</span>
                  <Badge variant="secondary" className="text-xs">
                    {tools.length} tool{tools.length !== 1 ? "s" : ""}
                  </Badge>
                </div>
                <ChevronDown
                  className={`h-4 w-4 text-muted-foreground shrink-0 transition-transform duration-200 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Tool grid — shown only when expanded */}
              {isOpen && (
                <div className="border-t border-border/40 bg-muted/20 p-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {tools.map((tool) => (
                      <Link
                        key={tool.id}
                        href={`/tools/${tool.category}/${tool.slug}`}
                        className="group rounded-lg border border-border/50 bg-card p-4 hover:border-primary/40 transition-all"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-sm">{tool.name}</span>
                          {tool.status !== "stable" && (
                            <Badge variant="outline" className="text-xs capitalize">
                              {tool.status}
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {tool.shortDescription}
                        </p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
