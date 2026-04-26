# MonkKit — Implementation Plan

## Context

Build **MonkKit** (tools.devops-monk.com) — an extensible collection of developer utilities, starting with 40+ JSON tools.

- **Web UI**: Free for everyone, no login required
- **API**: Login with Google or GitHub → generate API key → call tools programmatically
- **Rate limiting**: Free tier (e.g. 1000 req/day per key), tracked in MySQL
- **Support**: Donate / Buy Me a Coffee button in header and footer
- **Deploy**: Docker (Node.js standalone) behind existing Nginx on Hostinger VPS (168.231.79.163, SSH key auth)

Adding a new tool automatically makes it available on the web AND via API — zero extra wiring.

---

## Stack

| Layer | Choice | Reason |
|---|---|---|
| Framework | Next.js 14 App Router | SSR + API routes + static pages in one |
| Styling | Tailwind CSS + shadcn/ui | Rapid UI, dark mode |
| Code editor | CodeMirror 6 (`@uiw/react-codemirror`) | Lighter than Monaco |
| Auth | NextAuth.js v5 (Auth.js) | Google + GitHub SSO, session management |
| Database | MySQL (existing on VPS) + Prisma ORM | Users, API keys, usage tracking |
| API | Next.js Route Handlers (`/api/v1/...`) | Co-located with tool logic |
| Rate limiting | MySQL-backed counter (daily reset) | No Redis needed, MySQL already present |
| Build output | `output: 'standalone'` | Node.js server needed for auth + API |
| Container | Docker (node:20-alpine) | Standalone Next.js bundle |
| Reverse proxy | Existing Nginx on VPS | Routes `tools.devops-monk.com` → port 3001 |

---

## Project Structure

```
online-tools/
├── src/
│   ├── app/
│   │   ├── layout.tsx                    # Root layout (theme, session provider)
│   │   ├── page.tsx                      # Homepage — category grid
│   │   ├── globals.css
│   │   ├── sitemap.ts
│   │   │
│   │   ├── auth/
│   │   │   ├── signin/page.tsx           # Login page (Google + GitHub buttons)
│   │   │   └── error/page.tsx            # Auth error page
│   │   │
│   │   ├── dashboard/
│   │   │   └── page.tsx                  # User dashboard: API key, usage stats
│   │   │
│   │   ├── tools/
│   │   │   ├── layout.tsx                # Sidebar + header shell
│   │   │   ├── page.tsx                  # All tools listing + search
│   │   │   └── [category]/
│   │   │       ├── page.tsx              # Category landing
│   │   │       └── [tool]/
│   │   │           └── page.tsx          # Individual tool page
│   │   │
│   │   └── api/
│   │       ├── auth/[...nextauth]/
│   │       │   └── route.ts              # NextAuth.js handler
│   │       │
│   │       └── v1/
│   │           └── [category]/
│   │               └── [tool]/
│   │                   └── route.ts      # Universal API handler (POST)
│   │
│   ├── registry/                         # ← CENTRAL SOURCE OF TRUTH
│   │   ├── index.ts                      # Master registry + helpers
│   │   ├── categories.ts
│   │   └── tools/
│   │       └── json/
│   │           ├── index.ts              # Barrel: all JSON tools
│   │           ├── validator.ts          # One file per tool
│   │           └── ...
│   │
│   ├── tools/                            # Tool implementations
│   │   └── json/
│   │       ├── validator/
│   │       │   ├── index.tsx             # React component ('use client')
│   │       │   ├── logic.ts             # ← Pure functions: used by BOTH UI + API
│   │       │   ├── api-schema.ts        # Zod schema for API input validation
│   │       │   └── README.md            # Tool docs: description, API input/output, examples
│   │       └── ...
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── AppHeader.tsx            # Logo, search, login button, donate button, user menu
│   │   │   ├── AppFooter.tsx            # Donate link, social links, copyright
│   │   │   ├── AppSidebar.tsx
│   │   │   ├── DonateButton.tsx         # "Buy Me a Coffee" / Ko-fi button
│   │   │   └── ToolBreadcrumb.tsx
│   │   └── tool-ui/
│   │       ├── ToolShell.tsx
│   │       ├── CodeEditor.tsx
│   │       ├── SplitPane.tsx
│   │       ├── CopyButton.tsx
│   │       ├── DownloadButton.tsx
│   │       ├── PasteButton.tsx
│   │       ├── ClearButton.tsx
│   │       ├── FileUpload.tsx
│   │       └── ErrorDisplay.tsx
│   │
│   ├── lib/
│   │   ├── auth.ts                      # NextAuth config (Google + GitHub)
│   │   ├── db.ts                        # Prisma client singleton
│   │   ├── api-key.ts                   # Generate/validate API keys
│   │   └── rate-limit.ts               # MySQL-backed rate limiter
│   │
│   ├── hooks/
│   │   ├── useToolInput.ts
│   │   ├── useClipboard.ts
│   │   └── useToolSearch.ts
│   │
│   └── types/
│       └── registry.ts                  # Core TypeScript interfaces
│
├── prisma/
│   └── schema.prisma                    # DB schema (User, ApiKey, ApiUsage)
│
├── docker/
│   ├── Dockerfile
│   └── .dockerignore
│
├── next.config.ts
├── tailwind.config.ts
├── components.json
└── package.json
```

---

## Core TypeScript Interfaces (`src/types/registry.ts`)

```typescript
export type CategoryId = 'json' | 'encoding' | 'certificates' | 'images' | 'text' | 'network';

export interface ToolCategory {
  id: CategoryId;
  name: string;
  description: string;
  icon: string;        // lucide-react icon name
  color: string;       // Tailwind color for theming
  slug: string;
  order: number;
}

export interface ToolMeta {
  id: string;                // globally unique, e.g. "json-validator"
  slug: string;              // URL segment, e.g. "validator"
  name: string;
  shortDescription: string;  // 1 line for cards
  description: string;       // full paragraph for SEO <head>
  category: CategoryId;
  tags: string[];
  keywords: string[];
  icon: string;
  status: 'stable' | 'beta' | 'new';
}

export interface ToolDefinition extends ToolMeta {
  // Lazy component for web UI
  component: () => Promise<{ default: ComponentType<ToolComponentProps> }>;
  // API: path to logic module (same pure functions used in UI)
  logicModule: string;    // e.g. '@/tools/json/validator/logic'
}

export interface ToolComponentProps {
  toolMeta: ToolMeta;
}
```

---

## Database Schema (`prisma/schema.prisma`)

```prisma
model User {
  id        String    @id @default(cuid())
  email     String    @unique
  name      String?
  image     String?
  createdAt DateTime  @default(now())
  apiKey    ApiKey?
  accounts  Account[]
  sessions  Session[]
}

model ApiKey {
  id        String     @id @default(cuid())
  key       String     @unique  // "mk_live_..." prefix
  userId    String     @unique
  user      User       @relation(fields: [userId], references: [id])
  createdAt DateTime   @default(now())
  lastUsed  DateTime?
  usage     ApiUsage[]
}

model ApiUsage {
  id        Int      @id @default(autoincrement())
  apiKeyId  String
  apiKey    ApiKey   @relation(fields: [apiKeyId], references: [id])
  tool      String   // "json-validator"
  date      DateTime @default(now()) @db.Date
  count     Int      @default(0)

  @@unique([apiKeyId, tool, date])
}

// NextAuth required models
model Account { ... }
model Session { ... }
model VerificationToken { ... }
```

---

## API Design

### Endpoint
```
POST /api/v1/{category}/{tool}
Authorization: Bearer mk_live_xxxxxxxxxxxx
Content-Type: application/json
```

### Universal API Route Handler (`src/app/api/v1/[category]/[tool]/route.ts`)

```typescript
export async function POST(req, { params }) {
  // 1. Validate API key from Authorization header
  const apiKey = extractBearer(req);
  const keyRecord = await validateApiKey(apiKey);
  if (!keyRecord) return Response.json({ error: 'Invalid API key' }, { status: 401 });

  // 2. Check rate limit (1000 req/day per key)
  const allowed = await checkRateLimit(keyRecord.id, params.tool);
  if (!allowed) return Response.json({ error: 'Rate limit exceeded' }, { status: 429 });

  // 3. Find tool in registry
  const tool = getToolBySlug(params.category, params.tool);
  if (!tool) return Response.json({ error: 'Tool not found' }, { status: 404 });

  // 4. Load logic module and call it
  const body = await req.json();
  const logic = await import(tool.logicModule);
  const result = logic.process(body);   // same pure function the UI calls

  // 5. Track usage
  await incrementUsage(keyRecord.id, tool.id);

  return Response.json({ success: true, result });
}
```

### Example API call
```bash
curl -X POST https://tools.devops-monk.com/api/v1/json/validator \
  -H "Authorization: Bearer mk_live_abc123" \
  -H "Content-Type: application/json" \
  -d '{"input": "{\"name\": \"John\"}"}'

# Response
{
  "success": true,
  "result": { "valid": true, "formatted": "{\n  \"name\": \"John\"\n}" }
}
```

---

## Auth Flow (`src/lib/auth.ts`)

```typescript
// NextAuth.js v5 config
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({ clientId: process.env.GOOGLE_CLIENT_ID, clientSecret: process.env.GOOGLE_CLIENT_SECRET }),
    GitHub({ clientId: process.env.GITHUB_CLIENT_ID, clientSecret: process.env.GITHUB_CLIENT_SECRET }),
  ],
  adapter: PrismaAdapter(prisma),
  callbacks: {
    session({ session, user }) {
      session.user.id = user.id;
      return session;
    },
  },
});
```

User flow:
1. Click "Get API Key" in header → redirect to `/auth/signin`
2. Choose Google or GitHub → OAuth flow
3. On success → redirect to `/dashboard`
4. Dashboard shows API key (generated on first login), daily usage, docs

---

## Tool Logic Pattern — Key Insight

Each tool's `logic.ts` contains **pure functions** — no React, no Next.js, no browser APIs. The **same code** runs in both:
- The browser (called by the React component)
- The server (called by the API route handler)

Example `src/tools/json/validator/logic.ts`:
```typescript
export interface ValidatorInput {
  input: string;
  indent?: number;
}

export interface ValidatorOutput {
  valid: boolean;
  formatted?: string;
  error?: { message: string; line?: number; column?: number };
}

export function process(params: ValidatorInput): ValidatorOutput {
  try {
    const parsed = JSON.parse(params.input);
    return { valid: true, formatted: JSON.stringify(parsed, null, params.indent ?? 2) };
  } catch (e) {
    return { valid: false, error: { message: (e as SyntaxError).message } };
  }
}
```

---

## How to Add a New Tool (3 Steps, ~5 min)

### Step 1 — Create the tool folder
```
src/tools/json/my-tool/
├── index.tsx      # 'use client'; default export React component
├── logic.ts       # export function process(input): output  ← PURE, no React
├── api-schema.ts  # Zod schema for API input validation
└── README.md      # Tool documentation (see template below)
```

**`README.md` template for each tool:**
```markdown
# JSON My Tool

One-line description of what this tool does.

## API

**Endpoint:** `POST /api/v1/json/my-tool`

### Input
| Field  | Type   | Required | Description          |
|--------|--------|----------|----------------------|
| input  | string | yes      | The JSON string      |
| option | number | no       | Some option (default: 2) |

### Output
| Field     | Type    | Description                  |
|-----------|---------|------------------------------|
| success   | boolean | Whether processing succeeded |
| result    | string  | The processed output         |
| error     | string  | Error message if failed      |

## Example

\`\`\`bash
curl -X POST https://tools.devops-monk.com/api/v1/json/my-tool \
  -H "Authorization: Bearer mk_live_xxx" \
  -H "Content-Type: application/json" \
  -d '{"input": "{\"name\": \"John\"}"}'
\`\`\`

\`\`\`json
{ "success": true, "result": "..." }
\`\`\`
```

### Step 2 — Create registry entry
```typescript
// src/registry/tools/json/my-tool.ts
export const myTool: ToolDefinition = {
  id: 'json-my-tool',
  slug: 'my-tool',
  name: 'My Tool',
  shortDescription: 'Does X to JSON.',
  category: 'json',
  tags: ['x', 'y'],
  keywords: ['my tool online'],
  icon: 'Wand2',
  status: 'new',
  component: () => import('@/tools/json/my-tool'),
  process: (input) => import('@/tools/json/my-tool/logic').then(m => m.process(input)),
};
```

### Step 3 — Add to barrel
```typescript
// src/registry/tools/json/index.ts — add 2 lines
import { myTool } from './my-tool';
export const jsonTools = [...existingTools, myTool];
```

**Result:** Tool appears in web UI, sidebar, search, sitemap, AND is callable via API — automatically.

### To add a new category (e.g. Encoding)
1. Add `'encoding'` to `CategoryId` union in `src/types/registry.ts`
2. Add category object to `src/registry/categories.ts`
3. Create `src/registry/tools/encoding/index.ts` + tool files
4. Import barrel in `src/registry/index.ts`

Zero routing changes needed.

---

## Donate / Support Integration

**Recommended: Buy Me a Coffee** (simpler than Donorbox, built for indie devs)
- Sign up at buymeacoffee.com → get your link: `https://buymeacoffee.com/devopsmonk`
- Alternative: Ko-fi at `https://ko-fi.com/devopsmonk` (0% fees on donations)

**Where it appears:**
1. **Header** — small `☕ Support` button next to the login button
2. **Footer** — "If MonkKit saves you time, buy me a coffee ☕"
3. **Dashboard** — subtle card: "Enjoying MonkKit? Support development"

**`DonateButton.tsx`:**
```tsx
export function DonateButton() {
  return (
    <a
      href={process.env.NEXT_PUBLIC_DONATE_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm
                 bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20 transition"
    >
      ☕ <span className="hidden sm:inline">Support</span>
    </a>
  );
}
```

Add to `.env`: `NEXT_PUBLIC_DONATE_URL=https://buymeacoffee.com/devopsmonk`

---

## Deployment on Hostinger VPS

### `docker/Dockerfile`
```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npx prisma generate
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
EXPOSE 3000
CMD ["node", "server.js"]
```

### Environment variables on VPS (`/opt/monkkit/.env`)
```
DATABASE_URL="mysql://user:pass@localhost:3306/monkkit"
NEXTAUTH_SECRET="<random 32 char string>"
NEXTAUTH_URL="https://tools.devops-monk.com"
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."
GITHUB_CLIENT_ID="..."
GITHUB_CLIENT_SECRET="..."
NEXT_PUBLIC_DONATE_URL="https://buymeacoffee.com/devopsmonk"
```

### VPS Nginx server block (add to existing config)
```nginx
server {
    listen 80;
    server_name tools.devops-monk.com;
    location / {
        proxy_pass http://localhost:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```
Then: `certbot --nginx -d tools.devops-monk.com` for SSL.

### Deploy command
```bash
docker build -t monkkit .
docker stop monkkit 2>/dev/null; docker rm monkkit 2>/dev/null
docker run -d --name monkkit -p 3001:3000 \
  --env-file /opt/monkkit/.env \
  --restart unless-stopped monkkit
```

---

## Key Libraries

| Package | Used For |
|---|---|
| `next-auth` v5 | Google + GitHub SSO |
| `@prisma/client` + `prisma` | MySQL ORM |
| `@auth/prisma-adapter` | NextAuth + Prisma integration |
| `zod` | API input validation |
| `@uiw/react-codemirror` | Code editor |
| `jsonrepair` | JSON Repair tool |
| `ajv` | JSON Schema Validator |
| `jsonpath-plus` | JSONPath evaluator |
| `js-yaml` | JSON ↔ YAML |
| `fast-xml-parser` | JSON ↔ XML |
| `papaparse` | JSON ↔ CSV |
| `xlsx` (SheetJS) | JSON ↔ Excel |
| `quicktype-core` | All 9 code generators (TS, Python, Java, C#, Go, etc.) |
| `jose` | JWT decoder |
| `tiktoken` (WASM) | Token counter |
| `fuse.js` | Fuzzy search |
| `react-resizable-panels` | SplitPane resizer |
| `lucide-react` | Icons |
| `next-themes` | Dark/light mode |

---

## Implementation Order

### Phase 1 — Foundation
1. `npx create-next-app@latest` — TypeScript, Tailwind, App Router
2. Install shadcn/ui, configure dark theme (`#0f172a` bg, `#6366f1` accent)
3. Set up Prisma with MySQL schema (User, ApiKey, ApiUsage)
4. Configure NextAuth.js (Google + GitHub)
5. Build `AppHeader` (with DonateButton), `AppSidebar`, `AppFooter`, `ToolShell`, `SplitPane`, `CodeEditor`
6. Wire up `[category]/[tool]/page.tsx` routing
7. Build homepage and `/dashboard` (API key + usage + donate card)
8. Build universal API route handler

### Phase 2 — First 3 JSON Tools (prove full stack end-to-end)
9. JSON Validator — web UI + API
10. JSON Formatter / Pretty Print
11. JSON Minify

### Phase 3+ — Expand one tool at a time
12. Remaining Validate & Format tools (Sort Keys, Escape, Unescape, Stringify, Error Analyzer, Repair)
13. View & Query tools (Tree Viewer, Table Viewer, Diff, JSONPath, Search, Size Analyzer, Flatten)
14. Data Converters (CSV, YAML, XML, Excel, SQL, Markdown)
15. Code Generators via `quicktype-core`
16. Schema + Encoding tools (AJV, JWT, Base64, JSONC, Token Counter)

### Phase N — Deploy
17. Dockerfile + docker/Dockerfile
18. Add Nginx server block on VPS + SSL via certbot
19. GitHub Actions CI/CD (SSH deploy on push to `main`)

---

## Critical Files (Create in This Order)

1. `src/types/registry.ts` — all interfaces; everything references this
2. `prisma/schema.prisma` — DB schema
3. `src/lib/auth.ts` — NextAuth config
4. `src/registry/index.ts` — helper functions used by pages + API
5. `src/app/api/v1/[category]/[tool]/route.ts` — universal API handler
6. `src/components/tool-ui/ToolShell.tsx` + `CodeEditor.tsx` — UI building blocks

---

## Verification Checklist

- [ ] `npm run dev` → `/tools/json/validator` works in browser
- [ ] Sign in with Google → `/dashboard` → API key visible
- [ ] `curl` API with valid key → 200 with result
- [ ] `curl` with bad key → 401; over rate limit → 429
- [ ] `npm run build` → zero errors
- [ ] Docker build + run → `http://localhost:3001` works
- [ ] VPS: Nginx proxies, SSL cert issued, HTTPS loads
- [ ] Donate button links open correctly
