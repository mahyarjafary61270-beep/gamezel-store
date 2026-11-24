"use server";

import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { users } from "@/db/schema";
import { hashPassword, verifyPassword } from "@/lib/password";
import { createSession, destroySession } from "@/lib/session";

export type AuthState = {
  error: string | null;
  fieldErrors: {
    name?: string;
    email?: string;
    password?: string;
    confirm?: string;
  };
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function registerAction(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirm") ?? "");

  const fieldErrors: AuthState["fieldErrors"] = {};
  if (name.length < 2) fieldErrors.name = "نام باید حداقل ۲ حرف باشد.";
  if (!EMAIL_RE.test(email)) fieldErrors.email = "ایمیل وارد شده معتبر نیست.";
  if (password.length < 8) fieldErrors.password = "رمز عبور باید حداقل ۸ کاراکتر باشد.";
  if (password !== confirm) fieldErrors.confirm = "تکرار رمز عبور مطابقت ندارد.";
  if (Object.keys(fieldErrors).length > 0) {
    return { error: "لطفا خطاهای فرم را برطرف کنید.", fieldErrors };
  }

  const db = await getDb();
  const existing = await db.query.users.findFirst({ where: eq(users.email, email) });
  if (existing) {
    return { error: "این ایمیل قبلا ثبت شده است.", fieldErrors: { email: "این ایمیل قبلا ثبت شده است." } };
  }

  const id = crypto.randomUUID();
  await db.insert(users).values({
    id,
    email,
    passwordHash: await hashPassword(password),
    name,
    role: "user",
  });
  await createSession(id);
  redirect("/");
}

export async function loginAction(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "ایمیل و رمز عبور را وارد کنید.", fieldErrors: {} };
  }

  const db = await getDb();
  const user = await db.query.users.findFirst({ where: eq(users.email, email) });
  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    return { error: "ایمیل یا رمز عبور اشتباه است.", fieldErrors: {} };
  }

  await createSession(user.id);
  redirect(user.role === "admin" ? "/admin" : "/");
}

export async function logoutAction(): Promise<void> {
  await destroySession();
  redirect("/");
}
