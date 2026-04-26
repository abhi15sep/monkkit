import { nanoid } from "nanoid";
import { prisma } from "@/lib/db";

export function generateApiKey(): string {
  return `mk_live_${nanoid(32)}`;
}

export async function getOrCreateApiKey(userId: string): Promise<string> {
  const existing = await prisma.apiKey.findUnique({ where: { userId } });
  if (existing) return existing.key;

  const key = generateApiKey();
  await prisma.apiKey.create({ data: { key, userId } });
  return key;
}

export async function validateApiKey(key: string) {
  if (!key?.startsWith("mk_live_")) return null;
  const record = await prisma.apiKey.findUnique({ where: { key } });
  if (!record) return null;

  // Update lastUsed without blocking the response
  prisma.apiKey
    .update({ where: { id: record.id }, data: { lastUsed: new Date() } })
    .catch(() => {});

  return record;
}
