import Link from "next/link";
import { Braces, ArrowRight } from "lucide-react";
import { AppHeader } from "@/components/layout/AppHeader";
import { AppFooter } from "@/components/layout/AppFooter";
import { Badge } from "@/components/ui/badge";
import { registry } from "@/registry";

const CATEGORY_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  json: Braces,
};

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <AppHeader />

      <main className="flex-1 px-4 lg:px-8 py-12">
        {/* Hero */}
        <div className="max-w-2xl mx-auto text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            Free Developer Tools
          </h1>
          <p className="text-lg text-muted-foreground">
            Every tool you need, in one place. No login, no ads, no nonsense.
            Built by a DevOps engineer for developers.
          </p>
        </div>

        {/* Categories grid */}
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {registry.categories.map((category) => {
            const tools = registry.tools.filter(
              (t) => t.category === category.id
            );
            const Icon = CATEGORY_ICONS[category.id] ?? Braces;

            return (
              <Link
                key={category.id}
                href={`/tools/${category.slug}`}
                className="group rounded-xl border border-border/50 bg-card p-5 hover:border-primary/50 hover:bg-card/80 transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="rounded-lg bg-primary/10 p-2.5">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                </div>
                <h2 className="font-semibold mb-1">{category.name}</h2>
                <p className="text-sm text-muted-foreground mb-3">
                  {category.description}
                </p>
                <Badge variant="secondary" className="text-xs">
                  {tools.length} tool{tools.length !== 1 ? "s" : ""}
                </Badge>
              </Link>
            );
          })}
        </div>
      </main>

      <AppFooter />
    </div>
  );
}
