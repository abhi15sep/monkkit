"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Braces, ChevronDown } from "lucide-react";
import { useState } from "react";
import { registry } from "@/registry";
import { cn } from "@/lib/utils";

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Braces,
};

export function AppSidebar() {
  const pathname = usePathname();
  const [openCategories, setOpenCategories] = useState<string[]>(
    registry.categories.map((c) => c.id)
  );

  const toggle = (id: string) =>
    setOpenCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );

  return (
    <aside className="w-56 shrink-0 hidden md:flex flex-col border-r border-border/50 h-[calc(100vh-3.5rem)] sticky top-14 overflow-y-auto">
      <nav className="flex flex-col gap-1 p-3">
        {registry.categories.map((category) => {
          const Icon = ICONS[category.icon] ?? Braces;
          const tools = registry.tools.filter((t) => t.category === category.id);
          const isOpen = openCategories.includes(category.id);

          return (
            <div key={category.id}>
              <button
                onClick={() => toggle(category.id)}
                className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm font-medium
                           text-muted-foreground hover:text-foreground hover:bg-accent/10 transition-colors"
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span className="flex-1 text-left">{category.name}</span>
                <ChevronDown
                  className={cn(
                    "h-3.5 w-3.5 transition-transform",
                    isOpen && "rotate-180"
                  )}
                />
              </button>

              {isOpen && tools.length > 0 && (
                <div className="ml-6 mt-0.5 flex flex-col gap-0.5">
                  {tools.map((tool) => {
                    const href = `/tools/${tool.category}/${tool.slug}`;
                    const isActive = pathname === href;
                    return (
                      <Link
                        key={tool.id}
                        href={href}
                        className={cn(
                          "rounded-md px-2 py-1 text-sm transition-colors",
                          isActive
                            ? "bg-primary/15 text-primary font-medium"
                            : "text-muted-foreground hover:text-foreground hover:bg-accent/10"
                        )}
                      >
                        {tool.name}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
