"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { createApiKey, revokeApiKey } from "@/lib/api-key";
import { CATEGORIES } from "@/registry/categories";

const VALID_CATEGORIES = new Set<string>(CATEGORIES.map((c) => c.id));

export async function createApiKeyAction(formData: FormData) {
  const session = await auth();
  if (!session) throw new Error("Not authenticated");

  const name = (formData.get("name") as string | null)?.trim() || "Unnamed Key";
  const categories = formData.getAll("categories") as string[];
  const validCats = categories.filter((c) => VALID_CATEGORIES.has(c));
  if (validCats.length === 0) throw new Error("Select at least one category");

  await createApiKey(session.user.id, name, validCats);
  revalidatePath("/dashboard");
}

export async function revokeApiKeyAction(keyId: string) {
  const session = await auth();
  if (!session) throw new Error("Not authenticated");
  await revokeApiKey(session.user.id, keyId);
  revalidatePath("/dashboard");
}
