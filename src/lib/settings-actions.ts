"use server";

import { revalidatePath } from "next/cache";
import { getDb } from "@/db";
import { settings } from "@/db/schema";

export type SettingsState = { error: string | null; message: string | null };

const KEYS = ["card_number", "card_holder", "bank_name", "telegram_id", "order_notice"] as const;

export async function saveSettingsAction(_prev: SettingsState, formData: FormData): Promise<SettingsState> {
  const db = await getDb();
  for (const key of KEYS) {
    const value = String(formData.get(key) ?? "").trim();
    await db
      .insert(settings)
      .values({ key, value })
      .onConflictDoUpdate({ target: settings.key, set: { value } });
  }
  revalidatePath("/admin/settings");
  revalidatePath("/");
  return { error: null, message: "تنظیمات با موفقیت ذخیره شد." };
}
