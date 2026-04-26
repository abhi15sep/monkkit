"use client";

import { useState } from "react";
import { Eye, EyeOff, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AppHeader } from "@/components/layout/AppHeader";
import { AppFooter } from "@/components/layout/AppFooter";
import { CopyButton } from "@/components/tool-ui/CopyButton";

interface Props {
  apiKey: string;
  usageToday: number;
  usageLimit: number;
  userName: string;
}

export function DashboardClient({ apiKey, usageToday, usageLimit, userName }: Props) {
  const [visible, setVisible] = useState(false);
  const donateUrl = process.env.NEXT_PUBLIC_DONATE_URL ?? "https://buymeacoffee.com";

  return (
    <div className="flex flex-col min-h-screen">
      <AppHeader />

      <main className="flex-1 px-4 lg:px-8 py-10 max-w-2xl mx-auto w-full">
        <h1 className="text-2xl font-bold mb-1">
          Welcome{userName ? `, ${userName.split(" ")[0]}` : ""}!
        </h1>
        <p className="text-muted-foreground text-sm mb-8">
          Your API key lets you call any MonkKit tool programmatically.
        </p>

        {/* API Key card */}
        <section className="rounded-xl border border-border/50 bg-card p-5 mb-4">
          <h2 className="font-semibold mb-3">Your API Key</h2>
          <div className="flex items-center gap-2">
            <code className="flex-1 rounded-md bg-muted px-3 py-2 text-sm font-mono break-all">
              {visible ? apiKey : "mk_live_" + "•".repeat(32)}
            </code>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setVisible((v) => !v)}
              title={visible ? "Hide" : "Show"}
            >
              {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
            <CopyButton value={apiKey} label="" />
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Keep this key secret. Use it as{" "}
            <code className="bg-muted px-1 rounded">Authorization: Bearer &lt;key&gt;</code>
          </p>
        </section>

        {/* Usage */}
        <section className="rounded-xl border border-border/50 bg-card p-5 mb-4">
          <h2 className="font-semibold mb-3">Usage Today</h2>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold">{usageToday}</span>
            <span className="text-muted-foreground text-sm">/ {usageLimit} requests</span>
          </div>
          <div className="mt-2 h-2 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full bg-primary transition-all"
              style={{ width: `${Math.min((usageToday / usageLimit) * 100, 100)}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-2">Resets daily at midnight UTC.</p>
        </section>

        {/* Example */}
        <section className="rounded-xl border border-border/50 bg-card p-5 mb-4">
          <h2 className="font-semibold mb-3">Quick Start</h2>
          <pre className="bg-muted rounded-lg p-3 text-xs overflow-x-auto">
{`curl -X POST https://tools.devops-monk.com/api/v1/json/validator \\
  -H "Authorization: Bearer ${visible ? apiKey : "<your-api-key>"}" \\
  -H "Content-Type: application/json" \\
  -d '{"input": "{\\"name\\": \\"John\\"}"}'`}
          </pre>
        </section>

        {/* Donate */}
        <section className="rounded-xl border border-yellow-500/20 bg-yellow-500/5 p-5">
          <p className="text-sm">
            ☕ Enjoying MonkKit? It&apos;s free and always will be.{" "}
            <a
              href={donateUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-yellow-400 hover:underline font-medium"
            >
              Buy me a coffee
            </a>{" "}
            to support development!
          </p>
        </section>
      </main>

      <AppFooter />
    </div>
  );
}
