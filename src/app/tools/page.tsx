import Link from "next/link";
import { registry } from "@/registry";
import { Badge } from "@/components/ui/badge";

export const metadata = {
  title: "All Tools | MonkKit",
  description: "Browse all free developer tools on MonkKit.",
};

export default function ToolsPage() {
  return (
    <div className="p-4 lg:p-6">
      <h1 className="text-2xl font-bold mb-6">All Tools</h1>

      {registry.categories.map((category) => {
        const tools = registry.tools.filter((t) => t.category === category.id);
        if (!tools.length) return null;
        return (
          <section key={category.id} className="mb-8">
            <h2 className="text-lg font-semibold mb-3">{category.name}</h2>
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
          </section>
        );
      })}
    </div>
  );
}
