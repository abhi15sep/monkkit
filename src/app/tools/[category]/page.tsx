import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getCategory, getToolsByCategory, registry } from "@/registry";
import { Badge } from "@/components/ui/badge";
import type { CategoryId } from "@/types/registry";

export async function generateStaticParams() {
  return registry.categories.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  const cat = getCategory(category as CategoryId);
  if (!cat) return {};
  return {
    title: `${cat.name} | MonkKit`,
    description: cat.description,
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const cat = getCategory(category as CategoryId);
  if (!cat) notFound();

  const tools = getToolsByCategory(cat.id);

  return (
    <div className="p-4 lg:p-6">
      <h1 className="text-2xl font-bold mb-2">{cat.name}</h1>
      <p className="text-muted-foreground mb-6">{cat.description}</p>

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

      {tools.length === 0 && (
        <p className="text-muted-foreground text-sm">
          No tools yet. Check back soon!
        </p>
      )}
    </div>
  );
}
