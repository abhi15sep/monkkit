import Link from "next/link";
import { ExternalLink, Coffee, Heart, GitBranch } from "lucide-react";
import { AppHeader } from "@/components/layout/AppHeader";
import { AppFooter } from "@/components/layout/AppFooter";

export const metadata = { title: "About | MonkKit" };

const DONATE_URL = process.env.NEXT_PUBLIC_DONATE_URL ?? "https://buymeacoffee.com/abhi15sep";
const BUY_COFFEE_URL = "https://buymeacoffee.com/abhi15sep";

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <AppHeader />

      <main className="flex-1 max-w-2xl mx-auto w-full px-4 lg:px-8 py-12">
        {/* Avatar + name */}
        <div className="flex flex-col items-center text-center mb-10">
          <div className="h-24 w-24 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center text-4xl mb-4">
            🧘
          </div>
          <h1 className="text-3xl font-bold mb-1">Abhay Pratap Singh</h1>
          <p className="text-muted-foreground">DevOps Engineer · Builder · Open-source enthusiast</p>
        </div>

        {/* Bio */}
        <section className="prose prose-sm dark:prose-invert max-w-none mb-8">
          <p className="text-muted-foreground leading-relaxed">
            Hey! I&apos;m Abhay — a DevOps engineer who spends a lot of time wrangling JSON, YAML, and configs.
            I built MonkKit because I was tired of bouncing between a dozen different sites to do simple things
            like format JSON or decode a JWT. Everything is in one place, works instantly in your browser,
            and will always be free.
          </p>
          <p className="text-muted-foreground leading-relaxed mt-4">
            MonkKit is a side project I build and maintain in my spare time. If it saves you even a few minutes
            a week, consider buying me a coffee — it keeps the server running and motivates me to keep adding tools.
          </p>
        </section>

        {/* Links */}
        <section className="flex flex-col gap-3 mb-10">
          <a
            href={BUY_COFFEE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between rounded-xl border border-yellow-500/30 bg-yellow-500/5 px-5 py-4 hover:bg-yellow-500/10 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <Coffee className="h-5 w-5 text-yellow-400" />
              <div>
                <p className="font-medium text-sm">Buy me a coffee</p>
                <p className="text-xs text-muted-foreground">Support MonkKit development</p>
              </div>
            </div>
            <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-yellow-400 transition-colors" />
          </a>

          <a
            href={DONATE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between rounded-xl border border-primary/20 bg-primary/5 px-5 py-4 hover:bg-primary/10 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <Heart className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium text-sm">Donate</p>
                <p className="text-xs text-muted-foreground">Help keep MonkKit free for everyone</p>
              </div>
            </div>
            <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
          </a>

          <a
            href="https://github.com/abhi15sep"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between rounded-xl border border-border/50 bg-card px-5 py-4 hover:border-primary/30 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <GitBranch className="h-5 w-5" />
              <div>
                <p className="font-medium text-sm">GitHub</p>
                <p className="text-xs text-muted-foreground">github.com/abhi15sep</p>
              </div>
            </div>
            <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
          </a>

          <a
            href="https://devops-monk.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between rounded-xl border border-border/50 bg-card px-5 py-4 hover:border-primary/30 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <span className="text-xl">🧘</span>
              <div>
                <p className="font-medium text-sm">DevOps Monk</p>
                <p className="text-xs text-muted-foreground">devops-monk.com — blog & projects</p>
              </div>
            </div>
            <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
          </a>
        </section>

        {/* MonkKit info */}
        <section className="rounded-xl border border-border/50 bg-card p-5">
          <h2 className="font-semibold mb-2">About MonkKit</h2>
          <p className="text-sm text-muted-foreground mb-3">
            31 JSON tools (and growing) — all free, no login required for browser use.
            API access available with a free account.
          </p>
          <div className="flex flex-wrap gap-2">
            <Link href="/tools" className="text-xs px-3 py-1.5 rounded-full border border-border/50 bg-muted/30 hover:bg-muted transition-colors">
              Browse tools
            </Link>
            <Link href="/docs/api" className="text-xs px-3 py-1.5 rounded-full border border-border/50 bg-muted/30 hover:bg-muted transition-colors">
              API reference
            </Link>
            <Link href="/auth/signin" className="text-xs px-3 py-1.5 rounded-full border border-border/50 bg-muted/30 hover:bg-muted transition-colors">
              Get API key
            </Link>
          </div>
        </section>
      </main>

      <AppFooter />
    </div>
  );
}
