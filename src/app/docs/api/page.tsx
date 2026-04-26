import Link from "next/link";
import { Zap, Lock, Gauge, ArrowRight, ExternalLink, Terminal } from "lucide-react";
import { AppHeader } from "@/components/layout/AppHeader";
import { AppFooter } from "@/components/layout/AppFooter";
import { registry } from "@/registry";

export const metadata = { title: "API Reference | MonkKit" };

const BASE_URL = "https://tools.devops-monk.com";

// ─── Example request bodies per tool ────────────────────────────────────────

const EXAMPLES: Record<string, object> = {
  // JSON — Format & Fix
  "json/validator":      { input: '{"name":"Alice","age":32}' },
  "json/repair":         { input: "{name: 'Alice', age: 32,}" },
  "json/escape":         { input: '{"name":"Alice"}' },
  "json/unescape":       { input: '{\\\"name\\\": \\\"Alice\\\"}' },
  "json/stringify":      { input: "{ name: 'Alice', active: true }" },
  "json/sort":           { input: '{"z":1,"a":2}', direction: "asc" },
  // JSON — View & Query
  "json/diff":           { left: '{"a":1,"b":2}', right: '{"a":1,"b":3,"c":4}' },
  "json/jsonpath":       { input: '{"users":[{"name":"Alice"},{"name":"Bob"}]}', path: "$.users[*].name" },
  "json/flatten":        { input: '{"a":{"b":{"c":1}}}', delimiter: "." },
  "json/unflatten":      { input: '{"a.b.c":1}', delimiter: "." },
  "json/size":           { input: '{"name":"Alice","age":32}' },
  "json/search":         { input: '{"name":"Alice","role":"admin"}', query: "admin", searchIn: "both" },
  // JSON — Converters
  "json/to-yaml":        { input: '{"name":"Alice","age":32}', indent: 2 },
  "json/from-yaml":      { input: "name: Alice\nage: 32" },
  "json/to-csv":         { input: '[{"name":"Alice","age":32}]', delimiter: "," },
  "json/from-csv":       { input: "name,age\nAlice,32", header: true },
  "json/to-xml":         { input: '{"name":"Alice"}', rootTag: "root" },
  "json/from-xml":       { input: "<root><name>Alice</name></root>" },
  "json/to-toml":        { input: '{"title":"App","port":3000}' },
  "json/to-sql":         { input: '[{"id":1,"name":"Alice"}]', tableName: "users", dialect: "postgres" },
  // JSON — Code Generators
  "json/to-typescript":  { input: '{"name":"Alice","age":32}', typeName: "User" },
  "json/to-python":      { input: '{"name":"Alice","age":32}', typeName: "User" },
  "json/to-golang":      { input: '{"name":"Alice","age":32}', typeName: "User" },
  "json/to-java":        { input: '{"name":"Alice","age":32}', typeName: "User" },
  "json/to-csharp":      { input: '{"name":"Alice","age":32}', typeName: "User" },
  "json/to-rust":        { input: '{"name":"Alice","age":32}', typeName: "User" },
  "json/to-zod":         { input: '{"name":"Alice","age":32}', typeName: "User" },
  // JSON — Schema & Advanced
  "json/schema-validate":{ data: '{"name":"Alice","age":32}', schema: '{"type":"object","properties":{"name":{"type":"string"},"age":{"type":"integer"}}}' },
  "json/schema-generate":{ input: '{"name":"Alice","age":32}', title: "User", draft: "draft-07" },
  "json/jwt-decode":     { token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.dozjgNryP4J3jVmNHl0w5N_XgL0n3I9PlFUP0THsR8U" },
  "json/token-count":    { input: '{"messages":[{"role":"user","content":"Hello!"}]}', model: "gpt-4o" },
  // Generators
  "generators/qr-code":  { type: "url", value: "https://tools.devops-monk.com", size: 300, errorLevel: "M" },
  "generators/barcode":  { value: "MonkKit-2024", format: "CODE128", width: 2, height: 100 },
  // Encoding
  "encoding/base64":     { input: "Hello, World! 🌍", mode: "encode" },
  "encoding/url-encode": { input: "https://example.com/search?q=hello world", mode: "encode", encodeMode: "component" },
  "encoding/html-entities": { input: '<h1>Hello & "World"</h1>', mode: "encode" },
  "encoding/hash":       { input: "The quick brown fox", algorithms: ["MD5", "SHA-256", "SHA-512"] },
};

// ─── Sub-groups within JSON ──────────────────────────────────────────────────

const JSON_GROUPS = [
  { label: "Format & Fix", slugs: ["validator", "repair", "escape", "unescape", "stringify", "sort"] },
  { label: "View & Query", slugs: ["diff", "jsonpath", "flatten", "unflatten", "size", "search"] },
  { label: "Converters",   slugs: ["to-yaml", "from-yaml", "to-csv", "from-csv", "to-xml", "from-xml", "to-toml", "to-sql"] },
  { label: "Code Generators", slugs: ["to-typescript", "to-python", "to-golang", "to-java", "to-csharp", "to-rust", "to-zod"] },
  { label: "Schema & Advanced", slugs: ["schema-validate", "schema-generate", "jwt-decode", "token-count"] },
];

const STATUS_COLORS: Record<string, string> = {
  "401": "text-red-400 bg-red-400/10",
  "404": "text-orange-400 bg-orange-400/10",
  "429": "text-yellow-400 bg-yellow-400/10",
  "400": "text-orange-400 bg-orange-400/10",
  "500": "text-red-400 bg-red-400/10",
};

function CodeBlock({ children, label }: { children: string; label?: string }) {
  return (
    <div className="relative rounded-xl overflow-hidden border border-border/50">
      {label && (
        <div className="flex items-center gap-2 px-4 py-2 bg-muted/60 border-b border-border/50">
          <div className="flex gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
            <div className="h-2.5 w-2.5 rounded-full bg-yellow-400/70" />
            <div className="h-2.5 w-2.5 rounded-full bg-green-400/70" />
          </div>
          <span className="text-xs text-muted-foreground ml-1">{label}</span>
        </div>
      )}
      <pre className="bg-[#0d1117] text-[#e6edf3] p-5 text-sm font-mono overflow-x-auto leading-relaxed">
        {children}
      </pre>
    </div>
  );
}

function SubGroupDivider({ label }: { label: string }) {
  return (
    <h4 className="text-base font-semibold mb-4 flex items-center gap-2">
      <span className="h-px flex-1 bg-border/50" />
      <span>{label}</span>
      <span className="h-px flex-1 bg-border/50" />
    </h4>
  );
}

function ToolCard({ tool, categorySlug }: { tool: { id: string; slug: string; category: string; shortDescription: string }; categorySlug: string }) {
  const key = `${categorySlug}/${tool.slug}`;
  const ex = EXAMPLES[key];
  const path = `/api/v1/${categorySlug}/${tool.slug}`;
  return (
    <div className="rounded-2xl border border-border/50 bg-card overflow-hidden hover:border-primary/30 transition-colors">
      <div className="flex items-start justify-between gap-4 px-6 py-4 border-b border-border/30">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-1.5">
            <span className="shrink-0 rounded-md bg-primary/15 px-2.5 py-1 text-xs font-bold font-mono text-primary tracking-wide">POST</span>
            <code className="text-sm font-mono font-medium truncate">{path}</code>
          </div>
          <p className="text-sm text-muted-foreground">{tool.shortDescription}</p>
        </div>
        <Link
          href={`/tools/${tool.category}/${tool.slug}`}
          className="shrink-0 flex items-center gap-1 text-sm text-primary hover:underline"
        >
          Try it <ExternalLink className="h-3.5 w-3.5" />
        </Link>
      </div>
      {ex && (
        <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-border/30">
          <div className="p-5">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">Request Body</p>
            <pre className="bg-[#0d1117] text-[#e6edf3] rounded-xl p-4 text-sm font-mono overflow-x-auto leading-relaxed">
              {JSON.stringify(ex, null, 2)}
            </pre>
          </div>
          <div className="p-5">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">curl</p>
            <pre className="bg-[#0d1117] text-[#e6edf3] rounded-xl p-4 text-sm font-mono overflow-x-auto leading-relaxed whitespace-pre-wrap break-all">
              {`curl -X POST ${BASE_URL}${path} \\\n  -H "Authorization: Bearer <key>" \\\n  -H "Content-Type: application/json" \\\n  -d '${JSON.stringify(ex)}'`}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ApiDocsPage() {
  const allTools = registry.tools;
  const totalTools = allTools.length;

  const jsonTools = allTools.filter((t) => t.category === "json");
  const jsonToolMap = Object.fromEntries(jsonTools.map((t) => [t.slug, t]));
  const generatorTools = allTools.filter((t) => t.category === "generators");
  const encodingTools = allTools.filter((t) => t.category === "encoding");

  return (
    <div className="flex flex-col min-h-screen">
      <AppHeader />

      {/* Hero */}
      <div className="relative border-b border-border/50 bg-gradient-to-b from-primary/5 to-background overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.02] pointer-events-none" />
        <div className="max-w-5xl mx-auto px-4 lg:px-8 py-16">
          <div className="flex items-center gap-2 mb-4">
            <span className="flex items-center gap-1.5 rounded-full bg-primary/15 px-3 py-1 text-xs font-medium text-primary">
              <Terminal className="h-3 w-3" />
              REST API
            </span>
            <span className="text-xs text-muted-foreground">v1</span>
          </div>
          <h1 className="text-5xl font-bold tracking-tight mb-4">API Reference</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mb-8">
            Every MonkKit tool available as a JSON REST API.
            One endpoint pattern, one API key, {totalTools} tools.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/auth/signin"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              <Zap className="h-4 w-4" />
              Get your free API key
            </Link>
            <a
              href="#endpoints"
              className="inline-flex items-center gap-2 rounded-lg border border-border px-5 py-2.5 text-sm font-medium hover:bg-muted/50 transition-colors"
            >
              Browse endpoints
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 lg:px-8 py-12">

        {/* Overview cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-14">
          <div className="rounded-2xl border border-border/50 bg-card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="rounded-xl bg-primary/10 p-2.5"><Lock className="h-5 w-5 text-primary" /></div>
              <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">Required</span>
            </div>
            <h3 className="font-semibold text-base mb-1">Authentication</h3>
            <p className="text-sm text-muted-foreground mb-3">Pass your API key as a Bearer token in every request.</p>
            <code className="block text-xs bg-muted rounded-lg px-3 py-2 font-mono text-muted-foreground break-all">
              Authorization: Bearer mk_live_…
            </code>
          </div>

          <div className="rounded-2xl border border-border/50 bg-card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="rounded-xl bg-primary/10 p-2.5"><Zap className="h-5 w-5 text-primary" /></div>
              <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">Pattern</span>
            </div>
            <h3 className="font-semibold text-base mb-1">Endpoint</h3>
            <p className="text-sm text-muted-foreground mb-3">All tools share the same URL pattern. Always POST with JSON body.</p>
            <code className="block text-xs bg-muted rounded-lg px-3 py-2 font-mono text-muted-foreground">
              POST /api/v1/<span className="text-primary">category</span>/<span className="text-primary">tool</span>
            </code>
          </div>

          <div className="rounded-2xl border border-border/50 bg-card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="rounded-xl bg-primary/10 p-2.5"><Gauge className="h-5 w-5 text-primary" /></div>
              <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">Free tier</span>
            </div>
            <h3 className="font-semibold text-base mb-1">Rate Limit</h3>
            <p className="text-sm text-muted-foreground mb-3">Generous daily quota for building and automation.</p>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold">1,000</span>
              <span className="text-sm text-muted-foreground">requests / day</span>
            </div>
          </div>
        </div>

        {/* Quick start */}
        <section className="mb-14">
          <h2 className="text-2xl font-bold mb-2">Quick Start</h2>
          <p className="text-muted-foreground mb-6">Validate a JSON string in one curl command.</p>
          <CodeBlock label="terminal">{`curl -X POST ${BASE_URL}/api/v1/json/validator \\
  -H "Authorization: Bearer <your-api-key>" \\
  -H "Content-Type: application/json" \\
  -d '{"input": "{\\"name\\": \\"Alice\\", \\"age\\": 32}"}'`}</CodeBlock>
          <div className="mt-4">
            <CodeBlock label="response.json">{`{
  "success": true,
  "tool": "json-validator",
  "result": {
    "valid": true,
    "formatted": "{\\n  \\"name\\": \\"Alice\\",\\n  \\"age\\": 32\\n}"
  }
}`}</CodeBlock>
          </div>
        </section>

        {/* Response format */}
        <section className="mb-14">
          <h2 className="text-2xl font-bold mb-2">Response Format</h2>
          <p className="text-muted-foreground mb-6">
            Every endpoint returns the same wrapper — check{" "}
            <code className="bg-muted px-1.5 py-0.5 rounded text-sm">success</code> first, then read{" "}
            <code className="bg-muted px-1.5 py-0.5 rounded text-sm">result</code>.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-green-500 mb-2">✓ Success</p>
              <CodeBlock>{`{
  "success": true,
  "tool": "json-validator",
  "result": { ... }
}`}</CodeBlock>
            </div>
            <div>
              <p className="text-sm font-medium text-destructive mb-2">✗ Error</p>
              <CodeBlock>{`{
  "error": "Invalid API key"
}`}</CodeBlock>
            </div>
          </div>
        </section>

        {/* Error codes */}
        <section className="mb-14">
          <h2 className="text-2xl font-bold mb-2">Error Codes</h2>
          <p className="text-muted-foreground mb-6">Standard HTTP status codes indicate what went wrong.</p>
          <div className="rounded-2xl border border-border/50 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-muted/50 border-b border-border/50">
                  <th className="text-left px-5 py-3.5 text-sm font-medium">Status</th>
                  <th className="text-left px-5 py-3.5 text-sm font-medium">Meaning</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {[
                  ["401", "Missing or invalid API key"],
                  ["404", "Tool not found — check category/slug spelling"],
                  ["429", "Daily rate limit exceeded — resets at midnight UTC"],
                  ["400", "Invalid JSON request body"],
                  ["500", "Tool execution error — check your input"],
                ].map(([code, msg]) => (
                  <tr key={code} className="hover:bg-muted/20 transition-colors">
                    <td className="px-5 py-4">
                      <span className={`inline-block font-mono text-sm font-semibold px-2.5 py-1 rounded-lg ${STATUS_COLORS[code]}`}>
                        {code}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm text-muted-foreground">{msg}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ── All endpoints ─────────────────────────────────────────── */}
        <div id="endpoints" className="flex flex-col gap-16">

          {/* ── JSON ── */}
          <section>
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-2xl font-bold">JSON</h2>
              <span className="rounded-full bg-amber-500/15 px-3 py-1 text-xs font-medium text-amber-400">
                {jsonTools.length} tools
              </span>
            </div>
            <p className="text-muted-foreground mb-8">
              <code className="bg-muted px-1.5 py-0.5 rounded">POST {BASE_URL}/api/v1/json/<span className="text-primary">tool</span></code>
            </p>

            <div className="flex flex-col gap-10">
              {JSON_GROUPS.map((group) => {
                const tools = group.slugs.map((s) => jsonToolMap[s]).filter(Boolean);
                if (!tools.length) return null;
                return (
                  <div key={group.label}>
                    <SubGroupDivider label={group.label} />
                    <div className="flex flex-col gap-4">
                      {tools.map((tool) => (
                        <ToolCard key={tool.id} tool={tool} categorySlug="json" />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* ── Generators ── */}
          {generatorTools.length > 0 && (
            <section>
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-2xl font-bold">Generators</h2>
                <span className="rounded-full bg-violet-500/15 px-3 py-1 text-xs font-medium text-violet-400">
                  {generatorTools.length} tools
                </span>
              </div>
              <p className="text-muted-foreground mb-8">
                <code className="bg-muted px-1.5 py-0.5 rounded">POST {BASE_URL}/api/v1/generators/<span className="text-primary">tool</span></code>
              </p>
              <div className="flex flex-col gap-4">
                {generatorTools.map((tool) => (
                  <ToolCard key={tool.id} tool={tool} categorySlug="generators" />
                ))}
              </div>
            </section>
          )}

          {/* ── Encoding ── */}
          {encodingTools.length > 0 && (
            <section>
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-2xl font-bold">Encoding</h2>
                <span className="rounded-full bg-blue-500/15 px-3 py-1 text-xs font-medium text-blue-400">
                  {encodingTools.length} tools
                </span>
              </div>
              <p className="text-muted-foreground mb-8">
                <code className="bg-muted px-1.5 py-0.5 rounded">POST {BASE_URL}/api/v1/encoding/<span className="text-primary">tool</span></code>
              </p>
              <div className="flex flex-col gap-4">
                {encodingTools.map((tool) => (
                  <ToolCard key={tool.id} tool={tool} categorySlug="encoding" />
                ))}
              </div>
            </section>
          )}

        </div>
      </main>

      <AppFooter />
    </div>
  );
}
