import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getOrCreateApiKey } from "@/lib/api-key";
import { getUsageToday } from "@/lib/rate-limit";
import { prisma } from "@/lib/db";
import { DashboardClient } from "./DashboardClient";

export const metadata = { title: "Dashboard | MonkKit" };

export default async function DashboardPage() {
  const session = await auth();
  if (!session) redirect("/auth/signin");

  const apiKey = await getOrCreateApiKey(session.user.id);
  const keyRecord = await prisma.apiKey.findUnique({
    where: { userId: session.user.id },
  });
  const { total, limit } = keyRecord
    ? await getUsageToday(keyRecord.id)
    : { total: 0, limit: 1000 };

  return (
    <DashboardClient
      apiKey={apiKey}
      usageToday={total}
      usageLimit={limit}
      userName={session.user.name ?? ""}
    />
  );
}
