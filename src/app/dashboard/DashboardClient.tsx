"use client";

import { useState, useTransition, useRef } from "react";
import {
  Eye, EyeOff, BookOpen, ExternalLink, Plus, Trash2,
  Key, ChevronDown, ChevronUp, AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AppHeader } from "@/components/layout/AppHeader";
import { AppFooter } from "@/components/layout/AppFooter";
import { CopyButton } from "@/components/tool-ui/CopyButton";
import { createApiKeyAction, revokeApiKeyAction } from "./actions";
import type { ToolCategory } from "@/types/registry";

const USAGE_LIMIT = 1000;

interface ApiKey {
  id: string;
  key: string;
  name: string;
  createdAt: Date;
  lastUsed: Date | null;
  usageToday: number;
  permissions: { category: string }[];
}

interface Props {
  keys: ApiKey[];
  categories: ToolCategory[];
  userName: string;
}

// ── Create Key Form ──────────────────────────────────────────────────────────

function CreateKeyForm({
  categories,
  onDone,
}: {
  categories: ToolCategory[];
  onDone: () => void;
}) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  const [selected, setSelected] = useState<Set<string>>(
    new Set(categories.map((c) => c.id))
  );

  const toggle = (id: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    if (selected.size === 0) { setError("Select at least one category."); return; }
    const fd = new FormData(formRef.current!);
    selected.forEach((c) => fd.append("categories", c));
    startTransition(async () => {
      try {
        await createApiKeyAction(fd);
        onDone();
      } catch (err) {
        setError((err as Error).message);
      }
    });
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label className="block text-sm font-medium mb-1.5">Key name</label>
        <input
          name="name"
          required
          placeholder='e.g. "JSON Bot", "CI Pipeline"'
          className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Allowed categories</label>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => {
            const on = selected.has(cat.id);
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => toggle(cat.id)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
                  on
                    ? "bg-primary/15 border-primary/50 text-primary"
                    : "border-border text-muted-foreground hover:border-primary/30"
                }`}
              >
                {cat.name}
              </button>
            );
          })}
        </div>
        <p className="text-xs text-muted-foreground mt-1.5">
          This key can only call tools in the selected categories.
        </p>
      </div>

      {error && (
        <p className="flex items-center gap-1.5 text-sm text-destructive">
          <AlertCircle className="h-4 w-4 shrink-0" /> {error}
        </p>
      )}

      <div className="flex gap-2">
        <Button type="submit" disabled={pending} size="sm">
          {pending ? "Creating…" : "Create key"}
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={onDone}>
          Cancel
        </Button>
      </div>
    </form>
  );
}

// ── Single Key Card ──────────────────────────────────────────────────────────

function KeyCard({
  apiKey,
  categories,
}: {
  apiKey: ApiKey;
  categories: ToolCategory[];
}) {
  const [visible, setVisible] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [pending, startTransition] = useTransition();

  const displayKey = visible
    ? apiKey.key
    : apiKey.key.slice(0, 10) + "•".repeat(28);

  const pct = Math.min((apiKey.usageToday / USAGE_LIMIT) * 100, 100);
  const catMap = Object.fromEntries(categories.map((c) => [c.id, c]));
  const allowedCats = apiKey.permissions.map((p) => catMap[p.category]).filter(Boolean);

  const handleRevoke = () => {
    startTransition(async () => {
      await revokeApiKeyAction(apiKey.id);
    });
  };

  return (
    <div className="rounded-xl border border-border/50 bg-card overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-border/30">
        <div className="flex items-center gap-2 min-w-0">
          <Key className="h-4 w-4 text-muted-foreground shrink-0" />
          <span className="font-semibold truncate">{apiKey.name}</span>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          {allowedCats.map((cat) => (
            <span
              key={cat.id}
              className="px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary"
            >
              {cat.name}
            </span>
          ))}
        </div>
      </div>

      {/* Key + copy */}
      <div className="px-5 py-4 flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <code className="flex-1 rounded-md bg-muted px-3 py-2 text-sm font-mono break-all">
            {displayKey}
          </code>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setVisible((v) => !v)}
            title={visible ? "Hide" : "Show"}
          >
            {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
          <CopyButton value={apiKey.key} label="" />
        </div>

        {/* Usage bar */}
        <div>
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
            <span>Today: {apiKey.usageToday} / {USAGE_LIMIT} requests</span>
            <span>{Math.round(pct)}%</span>
          </div>
          <div className="h-1.5 rounded-full bg-muted overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${
                pct > 90 ? "bg-red-500" : pct > 70 ? "bg-yellow-500" : "bg-primary"
              }`}
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>

        {/* Meta + revoke */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>
            Created {new Date(apiKey.createdAt).toLocaleDateString()}
            {apiKey.lastUsed && (
              <> · Last used {new Date(apiKey.lastUsed).toLocaleDateString()}</>
            )}
          </span>
          {confirming ? (
            <div className="flex items-center gap-2">
              <span className="text-destructive">Revoke this key?</span>
              <Button
                size="sm"
                variant="destructive"
                className="h-6 px-2 text-xs"
                disabled={pending}
                onClick={handleRevoke}
              >
                {pending ? "…" : "Yes, revoke"}
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="h-6 px-2 text-xs"
                onClick={() => setConfirming(false)}
              >
                Cancel
              </Button>
            </div>
          ) : (
            <Button
              size="sm"
              variant="ghost"
              className="h-6 px-2 text-xs text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={() => setConfirming(true)}
            >
              <Trash2 className="h-3 w-3 mr-1" /> Revoke
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Dashboard ────────────────────────────────────────────────────────────────

export function DashboardClient({ keys, categories, userName }: Props) {
  const [creating, setCreating] = useState(false);
  const donateUrl = process.env.NEXT_PUBLIC_DONATE_URL ?? "https://buymeacoffee.com";

  const totalUsageToday = keys.reduce((s, k) => s + k.usageToday, 0);
  const firstKey = keys[0];

  return (
    <div className="flex flex-col min-h-screen">
      <AppHeader />

      <main className="flex-1 px-4 lg:px-8 py-10 max-w-2xl mx-auto w-full">
        <div className="flex items-center justify-between mb-1">
          <h1 className="text-2xl font-bold">
            Welcome{userName ? `, ${userName.split(" ")[0]}` : ""}!
          </h1>
          <Button size="sm" onClick={() => setCreating((v) => !v)} className="gap-1.5">
            {creating ? (
              <><ChevronUp className="h-4 w-4" /> Cancel</>
            ) : (
              <><Plus className="h-4 w-4" /> New API Key</>
            )}
          </Button>
        </div>
        <p className="text-muted-foreground text-sm mb-8">
          Create scoped API keys — each key controls which tool categories it can access.
        </p>

        {/* Create form */}
        {creating && (
          <section className="rounded-xl border border-primary/30 bg-primary/5 p-5 mb-6">
            <h2 className="font-semibold mb-4">New API Key</h2>
            <CreateKeyForm categories={categories} onDone={() => setCreating(false)} />
          </section>
        )}

        {/* Summary */}
        {keys.length > 0 && (
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="rounded-xl border border-border/50 bg-card p-4">
              <p className="text-xs text-muted-foreground mb-1">Active Keys</p>
              <p className="text-2xl font-bold">{keys.length}</p>
            </div>
            <div className="rounded-xl border border-border/50 bg-card p-4">
              <p className="text-xs text-muted-foreground mb-1">Total Requests Today</p>
              <p className="text-2xl font-bold">{totalUsageToday}</p>
            </div>
          </div>
        )}

        {/* Keys list */}
        {keys.length === 0 ? (
          <div className="rounded-xl border-2 border-dashed border-border p-10 text-center text-muted-foreground">
            <Key className="h-8 w-8 mx-auto mb-3 opacity-30" />
            <p className="font-medium mb-1">No API keys yet</p>
            <p className="text-sm mb-4">Create your first key to start using the API.</p>
            <Button size="sm" onClick={() => setCreating(true)} className="gap-1.5">
              <Plus className="h-4 w-4" /> Create First Key
            </Button>
          </div>
        ) : (
          <div className="flex flex-col gap-4 mb-6">
            {keys.map((k) => (
              <KeyCard key={k.id} apiKey={k} categories={categories} />
            ))}
          </div>
        )}

        {/* Quick start */}
        {firstKey && (
          <section className="rounded-xl border border-border/50 bg-card p-5 mb-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold">Quick Start</h2>
              <Link
                href="/docs/api"
                className="flex items-center gap-1 text-xs text-primary hover:underline"
              >
                <BookOpen className="h-3.5 w-3.5" />
                Full API reference
                <ExternalLink className="h-3 w-3" />
              </Link>
            </div>
            <pre className="bg-muted rounded-lg p-3 text-xs overflow-x-auto leading-relaxed">
{`curl -X POST https://tools.devops-monk.com/api/v1/json/validator \\
  -H "Authorization: Bearer ${firstKey.key}" \\
  -H "Content-Type: application/json" \\
  -d '{"input": "{\\"name\\": \\"Alice\\"}"}'`}
            </pre>
            <p className="text-xs text-muted-foreground mt-2">
              Pattern:{" "}
              <code className="bg-muted px-1 rounded font-mono">POST /api/v1/&#123;category&#125;/&#123;tool&#125;</code>
              {" "}— returns 403 if the key lacks permission for that category.
            </p>
          </section>
        )}

        {/* Donate */}
        <section className="rounded-xl border border-yellow-500/20 bg-yellow-500/5 p-5">
          <p className="text-sm">
            ☕ Enjoying MonkKit? It&apos;s free and always will be.{" "}
            <a href={donateUrl} target="_blank" rel="noopener noreferrer" className="text-yellow-400 hover:underline font-medium">
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
