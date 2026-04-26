import Link from "next/link";
import { Zap, Lock, Gauge, Terminal } from "lucide-react";
import { AppHeader } from "@/components/layout/AppHeader";
import { AppFooter } from "@/components/layout/AppFooter";
import { getToolsByCategory } from "@/registry";
import { CATEGORIES } from "@/registry/categories";

export const metadata = { title: "API Reference | MonkKit" };

const BASE_URL = "https://tools.devops-monk.com";

// Per-tool request body examples
const EXAMPLES: Record<string, { body: object; description: string }> = {
  "json/validator":      { body: { input: '{"name":"Alice","age":32}' }, description: "JSON string to validate" },
  "json/formatter":      { body: { input: '{"b":2,"a":1}', indent: 2, sortKeys: false }, description: "Format with 2-space indent" },
  "json/minify":         { body: { input: '{\n  "name": "Alice"\n}' }, description: "Minify whitespace" },
  "json/repair":         { body: { input: "{name: 'Alice', age: 32,}" }, description: "Fix broken JSON" },
  "json/escape":         { body: { input: '{"name":"Alice"}' }, description: "Escape for embedding" },
  "json/unescape":       { body: { input: '{\\\"name\\\": \\\"Alice\\\"}' }, description: "Unescape string" },
  "json/stringify":      { body: { input: "{ name: 'Alice', active: true }" }, description: "JS object → JSON" },
  "json/sort":           { body: { input: '{"z":1,"a":2}', direction: "asc" }, description: "Sort keys A→Z" },
  "json/diff":           { body: { left: '{"a":1,"b":2}', right: '{"a":1,"b":3,"c":4}' }, description: "Compare two objects" },
  "json/jsonpath":       { body: { input: '{"users":[{"name":"Alice"},{"name":"Bob"}]}', path: "$.users[*].name" }, description: "JSONPath expression" },
  "json/flatten":        { body: { input: '{"a":{"b":{"c":1}}}', delimiter: "." }, description: "Flatten nested JSON" },
  "json/unflatten":      { body: { input: '{"a.b.c":1}', delimiter: "." }, description: "Restore nesting" },
  "json/size":           { body: { input: '{"name":"Alice","age":32}' }, description: "Analyze size" },
  "json/search":         { body: { input: '{"name":"Alice","role":"admin"}', query: "admin", searchIn: "both" }, description: "Search keys/values" },
  "json/to-yaml":        { body: { input: '{"name":"Alice","age":32}', indent: 2 }, description: "Convert to YAML" },
  "json/from-yaml":      { body: { input: "name: Alice\nage: 32" }, description: "Convert YAML to JSON" },
  "json/to-csv":         { body: { input: '[{"name":"Alice","age":32}]', delimiter: "," }, description: "Array to CSV" },
  "json/from-csv":       { body: { input: "name,age\nAlice,32", header: true }, description: "CSV to JSON array" },
  "json/to-xml":         { body: { input: '{"name":"Alice"}', rootTag: "root" }, description: "Convert to XML" },
  "json/from-xml":       { body: { input: "<root><name>Alice</name></root>" }, description: "XML to JSON" },
  "json/to-toml":        { body: { input: '{"title":"App","port":3000}' }, description: "Convert to TOML" },
  "json/to-sql":         { body: { input: '[{"id":1,"name":"Alice"}]', tableName: "users", dialect: "postgres" }, description: "Generate INSERT statements" },
  "json/to-typescript":  { body: { input: '{"name":"Alice","age":32}', typeName: "User" }, description: "Generate TypeScript interfaces" },
  "json/to-python":      { body: { input: '{"name":"Alice","age":32}', typeName: "User" }, description: "Generate Python dataclasses" },
  "json/to-golang":      { body: { input: '{"name":"Alice","age":32}', typeName: "User" }, description: "Generate Go structs" },
  "json/to-java":        { body: { input: '{"name":"Alice","age":32}', typeName: "User" }, description: "Generate Java POJOs" },
  "json/to-csharp":      { body: { input: '{"name":"Alice","age":32}', typeName: "User" }, description: "Generate C# classes" },
  "json/to-rust":        { body: { input: '{"name":"Alice","age":32}', typeName: "User" }, description: "Generate Rust structs" },
  "json/to-zod":         { body: { input: '{"name":"Alice","age":32}', typeName: "User" }, description: "Generate Zod schema" },
  "json/schema-validate":{ body: { data: '{"name":"Alice","age":32}', schema: '{"type":"object","required":["name"],"properties":{"name":{"type":"string"},"age":{"type":"integer"}}}' }, description: "Validate against JSON Schema" },
  "json/schema-generate":{ body: { input: '{"name":"Alice","age":32}', title: "User", draft: "draft-07" }, description: "Infer JSON Schema" },
  "json/jwt-decode":     { body: { token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.dozjgNryP4J3jVmNHl0w5N_XgL0n3I9PlFUP0THsR8U" }, description: "Decode JWT" },
  "json/token-count":    { body: { input: '{"messages":[{"role":"user","content":"Hello!"}]}', model: "gpt-4o" }, description: "Count GPT tokens" },
};

export default function ApiDocsPage() {
  const jsonTools = getToolsByCategory("json");

  return (
    <div className="flex flex-col min-h-screen">
      <AppHeader />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 lg:px-8 py-10">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-2">
            <Terminal className="h-5 w-5 text-primary" />
            <h1 className="text-3xl font-bold">API Reference</h1>
          </div>
          <p className="text-muted-foreground">
            Every MonkKit tool is available as a REST API. Use your API key to call any tool programmatically.
          </p>
        </div>

        {/* Info cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          <div className="rounded-xl border border-border/50 bg-card p-4">
            <div className="flex items-center gap-2 mb-1">
              <Lock className="h-4 w-4 text-primary" />
              <span className="font-medium text-sm">Authentication</span>
            </div>
            <p className="text-xs text-muted-foreground">Bearer token in <code className="bg-muted px-1 rounded">Authorization</code> header. <Link href="/auth/signin" className="text-primary hover:underline">Get your key →</Link></p>
          </div>
          <div className="rounded-xl border border-border/50 bg-card p-4">
            <div className="flex items-center gap-2 mb-1">
              <Zap className="h-4 w-4 text-primary" />
              <span className="font-medium text-sm">Endpoint Pattern</span>
            </div>
            <code className="text-xs bg-muted px-2 py-1 rounded block font-mono">POST /api/v1/{"{category}/{tool}"}</code>
          </div>
          <div className="rounded-xl border border-border/50 bg-card p-4">
            <div className="flex items-center gap-2 mb-1">
              <Gauge className="h-4 w-4 text-primary" />
              <span className="font-medium text-sm">Rate Limit</span>
            </div>
            <p className="text-xs text-muted-foreground">1,000 requests/day per API key. Resets at midnight UTC.</p>
          </div>
        </div>

        {/* Quick start */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-3">Quick Start</h2>
          <pre className="rounded-xl bg-muted p-4 text-xs font-mono overflow-x-auto leading-relaxed">{`curl -X POST ${BASE_URL}/api/v1/json/validator \\
  -H "Authorization: Bearer <your-api-key>" \\
  -H "Content-Type: application/json" \\
  -d '{"input": "{\\"name\\": \\"Alice\\", \\"age\\": 32}"}'`}</pre>

          <div className="mt-3 rounded-xl bg-muted/50 border border-border/50 p-4 text-xs font-mono overflow-x-auto leading-relaxed">
            <span className="text-muted-foreground">// Response</span>{"\n"}
            {JSON.stringify({ success: true, tool: "json-validator", result: { valid: true, formatted: '{\n  "name": "Alice",\n  "age": 32\n}' } }, null, 2)}
          </div>
        </section>

        {/* Error responses */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-3">Error Responses</h2>
          <div className="overflow-x-auto rounded-xl border border-border/50">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left px-4 py-2.5 font-medium text-xs text-muted-foreground">Status</th>
                  <th className="text-left px-4 py-2.5 font-medium text-xs text-muted-foreground">Meaning</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {[
                  ["401", "Missing or invalid API key"],
                  ["404", "Tool not found — check category/slug spelling"],
                  ["429", "Daily rate limit exceeded (1 000 req/day)"],
                  ["400", "Invalid JSON body"],
                  ["500", "Tool execution error — check your input"],
                ].map(([code, msg]) => (
                  <tr key={code}>
                    <td className="px-4 py-2.5 font-mono text-xs">{code}</td>
                    <td className="px-4 py-2.5 text-xs text-muted-foreground">{msg}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* JSON tools */}
        {CATEGORIES.map((cat) => {
          const tools = cat.id === "json" ? jsonTools : [];
          if (tools.length === 0) return null;
          return (
            <section key={cat.id} className="mb-10">
              <h2 className="text-xl font-semibold mb-1 capitalize">{cat.name} Tools</h2>
              <p className="text-sm text-muted-foreground mb-4">{cat.description}</p>

              <div className="flex flex-col gap-4">
                {tools.map((tool) => {
                  const key = `${tool.category}/${tool.slug}`;
                  const ex = EXAMPLES[key];
                  const endpoint = `POST /api/v1/${tool.category}/${tool.slug}`;
                  return (
                    <div key={tool.id} className="rounded-xl border border-border/50 bg-card overflow-hidden">
                      <div className="flex items-start justify-between gap-2 px-4 py-3 border-b border-border/30 bg-muted/20">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono text-primary bg-primary/10 px-2 py-0.5 rounded">POST</span>
                            <code className="text-xs font-mono">/api/v1/{tool.category}/{tool.slug}</code>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">{tool.shortDescription}</p>
                        </div>
                        <Link
                          href={`/tools/${tool.category}/${tool.slug}`}
                          className="shrink-0 text-xs text-primary hover:underline"
                        >
                          Try in browser →
                        </Link>
                      </div>
                      {ex && (
                        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border/30">
                          <div className="p-3">
                            <p className="text-xs text-muted-foreground mb-1.5 font-medium">Request body</p>
                            <pre className="text-xs font-mono bg-muted/40 rounded-lg p-2.5 overflow-x-auto">{JSON.stringify(ex.body, null, 2)}</pre>
                          </div>
                          <div className="p-3">
                            <p className="text-xs text-muted-foreground mb-1.5 font-medium">curl example</p>
                            <pre className="text-xs font-mono bg-muted/40 rounded-lg p-2.5 overflow-x-auto whitespace-pre-wrap break-all">{`curl -X POST ${BASE_URL}/${endpoint.replace("POST ", "")} \\
  -H "Authorization: Bearer <key>" \\
  -H "Content-Type: application/json" \\
  -d '${JSON.stringify(ex.body)}'`}</pre>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          );
        })}
      </main>

      <AppFooter />
    </div>
  );
}
