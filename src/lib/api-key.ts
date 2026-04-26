import { nanoid } from "nanoid";
import { prisma } from "@/lib/db";
import { CATEGORIES } from "@/registry/categories";

export function generateApiKey(): string {
  return `mk_live_${nanoid(32)}`;
}

export const ALL_CATEGORY_IDS = CATEGORIES.map((c) => c.id);

export async function createApiKey(
  userId: string,
  name: string,
  categories: string[]
) {
  const key = generateApiKey();
  return prisma.apiKey.create({
    data: {
      key,
      name,
      userId,
      permissions: {
        create: categories.map((category) => ({ category })),
      },
    },
    include: { permissions: true },
  });
}

export async function getUserApiKeys(userId: string) {
  return prisma.apiKey.findMany({
    where: { userId },
    include: { permissions: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function revokeApiKey(userId: string, keyId: string) {
  // Verify ownership before deleting
  await prisma.apiKey.deleteMany({ where: { id: keyId, userId } });
}

export async function validateApiKey(key: string) {
  if (!key?.startsWith("mk_live_")) return null;
  const record = await prisma.apiKey.findUnique({
    where: { key },
    include: { permissions: true },
  });
  if (!record) return null;

  prisma.apiKey
    .update({ where: { id: record.id }, data: { lastUsed: new Date() } })
    .catch(() => {});

  return record;
}
