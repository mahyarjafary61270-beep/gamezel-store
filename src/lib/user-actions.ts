"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { users } from "@/db/schema";
import { getCurrentUser } from "@/lib/session";

export type UserActionState = { error: string | null };

export async function updateUserRoleAction(_prev: UserActionState, formData: FormData): Promise<UserActionState> {
  const userId = String(formData.get("userId") ?? "");
  const role = String(formData.get("role") ?? "");
  if (!["user", "admin"].includes(role)) return { error: "نقش نامعتبر است." };

  const current = await getCurrentUser();
  if (!current || current.role !== "admin") return { error: "دسترسی غیرمجاز." };
  if (current.id === userId) return { error: "نقش خودتان را نمی‌توانید تغییر دهید." };

  const db = await getDb();
  await db
    .update(users)
    .set({ role: role as "user" | "admin" })
    .where(eq(users.id, userId));
  revalidatePath("/admin/users");
  return { error: null };
}
