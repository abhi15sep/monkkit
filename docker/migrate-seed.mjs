// Runs after prisma db push — grants all-category permissions to any existing
// API keys that have none (e.g. keys created before the permissions feature).
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const ALL_CATEGORIES = ["json", "generators", "encoding"];

async function main() {
  const keysWithoutPerms = await prisma.apiKey.findMany({
    where: { permissions: { none: {} } },
    select: { id: true, name: true },
  });

  if (keysWithoutPerms.length === 0) {
    console.log("[monkkit] No keys need permission seeding.");
    return;
  }

  console.log(`[monkkit] Seeding permissions for ${keysWithoutPerms.length} existing key(s)...`);
  for (const key of keysWithoutPerms) {
    await prisma.apiKeyPermission.createMany({
      data: ALL_CATEGORIES.map((category) => ({ apiKeyId: key.id, category })),
      skipDuplicates: true,
    });
    console.log(`  → ${key.name} (${key.id}): granted ${ALL_CATEGORIES.join(", ")}`);
  }
  console.log("[monkkit] Permission seeding done.");
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error("[monkkit] Seed error:", e);
    prisma.$disconnect();
    process.exit(1);
  });
