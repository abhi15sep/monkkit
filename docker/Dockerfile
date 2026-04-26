FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
COPY .npmrc ./
RUN npm ci --registry https://registry.npmjs.org

COPY prisma ./prisma
RUN npx prisma generate

COPY . .
RUN npm run build

# ── Runner ────────────────────────────────────────────────────────────────────
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Standalone Next.js server + static assets
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Prisma CLI (needed for db push in entrypoint)
COPY --from=builder /app/node_modules/prisma ./node_modules/prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

# Schema (needed by prisma db push) + seed script
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/docker/migrate-seed.mjs ./docker/migrate-seed.mjs

# Entrypoint: db push → seed → start
COPY docker/entrypoint.sh ./entrypoint.sh
RUN chmod +x entrypoint.sh

EXPOSE 3000
ENTRYPOINT ["./entrypoint.sh"]
