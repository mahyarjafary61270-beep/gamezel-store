"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { and, count, eq, inArray, isNull } from "drizzle-orm";
import { getDb } from "@/db";
import { categories, credentials, games, images, listings } from "@/db/schema";
import { MAX_IMAGE_BYTES, parseDataUrl } from "@/lib/image-utils";
import { newId, parseNumber, toSlug } from "@/lib/format";

export type FormState = {
  error: string | null;
  message?: string | null;
  fieldErrors: Record<string, string>;
};

function str(fd: FormData, key: string): string {
  return String(fd.get(key) ?? "").trim();
}

function parseLines(text: string): string[] {
  return text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);
}

function parseSpecs(text: string): Record<string, string> {
  const specs: Record<string, string> = {};
  for (const line of parseLines(text)) {
    const i = line.indexOf(":");
    if (i <= 0) continue;
    specs[line.slice(0, i).trim()] = line.slice(i + 1).trim();
  }
  return specs;
}

function parseCredentialsText(text: string): { username: string; password: string }[] {
  const rows: { username: string; password: string }[] = [];
  for (const line of parseLines(text)) {
    const i = line.indexOf(":");
    if (i <= 0) continue;
    const username = line.slice(0, i).trim();
    const password = line.slice(i + 1).trim();
    if (username && password) rows.push({ username, password });
  }
  return rows;
}

async function insertImages(
  db: Awaited<ReturnType<typeof getDb>>,
  ownerType: "game" | "listing",
  ownerId: string,
  dataUrls: string[],
  startOrder: number
): Promise<void> {
  for (const [i, url] of dataUrls.entries()) {
    const parsed = parseDataUrl(url);
    if (!parsed) throw new Error("یکی از تصاویر معتبر نیست.");
    if (parsed.bytes.byteLength > MAX_IMAGE_BYTES) {
      throw new Error("حجم تصویر پس از فشرده‌سازی نباید بیش از ۵۰۰ کیلوبایت باشد.");
    }
    await db.insert(images).values({
      id: newId("img"),
      ownerType,
      ownerId,
      mime: parsed.mime,
      alt: "",
      data: parsed.bytes,
      sortOrder: startOrder + i,
    });
  }
}

// ---------- دسته‌بندی‌ها ----------

export async function saveCategoryAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const id = str(formData, "id");
  const name = str(formData, "name");
  const slug = str(formData, "slug").toLowerCase();
  const sortOrder = parseNumber(str(formData, "sortOrder")) ?? 0;

  const fieldErrors: Record<string, string> = {};
  if (!name) fieldErrors.name = "نام دسته الزامی است.";
  if (!slug) fieldErrors.slug = "اسلاگ الزامی است (حروف انگلیسی).";
  else if (!/^[a-z0-9][a-z0-9-]*$/.test(slug)) fieldErrors.slug = "اسلاگ فقط حروف انگلیسی، عدد و خط تیره می‌پذیرد.";
  if (Object.keys(fieldErrors).length > 0) {
    return { error: "لطفا خطاهای فرم را برطرف کنید.", fieldErrors };
  }

  const db = await getDb();
  const dupe = await db
    .select({ id: categories.id })
    .from(categories)
    .where(eq(categories.slug, slug))
    .get();
  if (dupe && dupe.id !== id) {
    return { error: "این اسلاگ قبلا استفاده شده است.", fieldErrors: { slug: "اسلاگ تکراری است." } };
  }

  if (id) {
    await db.update(categories).set({ name, slug, sortOrder }).where(eq(categories.id, id));
  } else {
    await db.insert(categories).values({ id: newId("cat"), name, slug, sortOrder });
  }
  revalidatePath("/admin/categories");
  redirect("/admin/categories");
}

export async function deleteCategoryAction(formData: FormData): Promise<void> {
  const id = str(formData, "id");
  if (!id) return;
  const db = await getDb();
  await db.update(games).set({ categoryId: null }).where(eq(games.categoryId, id));
  await db.delete(categories).where(eq(categories.id, id));
  revalidatePath("/admin/categories");
  revalidatePath("/admin/games");
}

// ---------- بازی‌ها ----------

export async function saveGameAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const id = str(formData, "id");
  const title = str(formData, "title");
  const englishTitle = str(formData, "englishTitle");
  const slug = str(formData, "slug") ? toSlug(str(formData, "slug")) : toSlug(englishTitle);
  const categoryId = str(formData, "categoryId") || null;
  const description = str(formData, "description");
  const features = parseLines(str(formData, "features"));
  const sortOrder = parseNumber(str(formData, "sortOrder")) ?? 0;
  const isActive = formData.get("isActive") === "on";
  const imageDataUrls = formData.getAll("images").map(String).filter(Boolean);

  const fieldErrors: Record<string, string> = {};
  if (!title) fieldErrors.title = "عنوان فارسی الزامی است.";
  if (!englishTitle) fieldErrors.englishTitle = "عنوان انگلیسی الزامی است.";
  if (!slug) fieldErrors.englishTitle = "برای ساخت اسلاگ، عنوان انگلیسی معتبر وارد کنید.";
  if (Object.keys(fieldErrors).length > 0) {
    return { error: "لطفا خطاهای فرم را برطرف کنید.", fieldErrors };
  }

  const db = await getDb();
  const dupe = await db.select({ id: games.id }).from(games).where(eq(games.slug, slug)).get();
  if (dupe && dupe.id !== id) {
    return { error: "این اسلاگ قبلا برای بازی دیگری ثبت شده است.", fieldErrors: {} };
  }

  let gameId = id;
  if (id) {
    await db
      .update(games)
      .set({ title, englishTitle, slug, categoryId, description, features, sortOrder, isActive })
      .where(eq(games.id, id));
  } else {
    gameId = newId("game");
    await db.insert(games).values({
      id: gameId,
      title,
      englishTitle,
      slug,
      categoryId,
      description,
      features,
      sortOrder,
      isActive,
    });
  }

  if (imageDataUrls.length > 0) {
    const [existing] = await db
      .select({ c: count() })
      .from(images)
      .where(and(eq(images.ownerType, "game"), eq(images.ownerId, gameId)));
    try {
      await insertImages(db, "game", gameId, imageDataUrls, existing.c);
    } catch (e) {
      return { error: e instanceof Error ? e.message : "خطا در ذخیره تصاویر.", fieldErrors: {} };
    }
  }

  revalidatePath("/admin/games");
  revalidatePath(`/admin/games/${gameId}`);
  revalidatePath("/");
  redirect(`/admin/games/${gameId}`);
}

export async function deleteGameAction(formData: FormData): Promise<void> {
  const id = str(formData, "id");
  if (!id) return;
  const db = await getDb();
  const listingRows = await db.select({ id: listings.id }).from(listings).where(eq(listings.gameId, id));
  const listingIds = listingRows.map((r) => r.id);
  await db.delete(images).where(and(eq(images.ownerType, "game"), eq(images.ownerId, id)));
  if (listingIds.length > 0) {
    await db.delete(images).where(and(eq(images.ownerType, "listing"), inArray(images.ownerId, listingIds)));
    await db.delete(credentials).where(and(inArray(credentials.listingId, listingIds), isNull(credentials.orderItemId)));
    await db.delete(listings).where(inArray(listings.id, listingIds));
  }
  await db.delete(games).where(eq(games.id, id));
  revalidatePath("/admin/games");
  revalidatePath("/admin/listings");
  revalidatePath("/");
}

export async function deleteImageAction(formData: FormData): Promise<void> {
  const id = str(formData, "id");
  if (!id) return;
  const db = await getDb();
  await db.delete(images).where(eq(images.id, id));
  revalidatePath("/admin/games");
  revalidatePath("/admin/listings");
  revalidatePath("/");
}

// ---------- اکانت‌ها (لیستینگ‌ها) ----------

export async function saveListingAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const id = str(formData, "id");
  const gameId = str(formData, "gameId");
  const title = str(formData, "title");
  const description = str(formData, "description");
  const price = parseNumber(str(formData, "price"));
  const specs = parseSpecs(str(formData, "specs"));
  const sortOrder = parseNumber(str(formData, "sortOrder")) ?? 0;
  const isActive = formData.get("isActive") === "on";
  const imageDataUrls = formData.getAll("images").map(String).filter(Boolean);
  const newCreds = id ? [] : parseCredentialsText(str(formData, "credentials"));

  const fieldErrors: Record<string, string> = {};
  if (!gameId) fieldErrors.gameId = "بازی را انتخاب کنید.";
  if (!title) fieldErrors.title = "عنوان اکانت الزامی است.";
  if (Object.keys(fieldErrors).length > 0) {
    return { error: "لطفا خطاهای فرم را برطرف کنید.", fieldErrors };
  }
  if (price == null || price <= 0) {
    return { error: "لطفا خطاهای فرم را برطرف کنید.", fieldErrors: { price: "قیمت معتبر (تومان) وارد کنید." } };
  }

  const db = await getDb();
  let listingId = id;
  if (id) {
    await db
      .update(listings)
      .set({ gameId, title, description, specs, price, sortOrder, isActive, updatedAt: new Date() })
      .where(eq(listings.id, id));
  } else {
    listingId = newId("lst");
    await db.insert(listings).values({
      id: listingId,
      gameId,
      title,
      description,
      specs,
      price,
      sortOrder,
      isActive,
    });
    if (newCreds.length > 0) {
      await db.insert(credentials).values(
        newCreds.map((c) => ({
          id: newId("cred"),
          listingId,
          username: c.username,
          password: c.password,
        }))
      );
    }
  }

  if (imageDataUrls.length > 0) {
    const [existing] = await db
      .select({ c: count() })
      .from(images)
      .where(and(eq(images.ownerType, "listing"), eq(images.ownerId, listingId)));
    try {
      await insertImages(db, "listing", listingId, imageDataUrls, existing.c);
    } catch (e) {
      return { error: e instanceof Error ? e.message : "خطا در ذخیره تصاویر.", fieldErrors: {} };
    }
  }

  revalidatePath("/admin/listings");
  revalidatePath(`/admin/listings/${listingId}`);
  revalidatePath("/");
  redirect(`/admin/listings/${listingId}`);
}

export async function deleteListingAction(formData: FormData): Promise<void> {
  const id = str(formData, "id");
  if (!id) return;
  const db = await getDb();
  const ops: Parameters<typeof db.batch>[0] = [
    db.delete(images).where(and(eq(images.ownerType, "listing"), eq(images.ownerId, id))),
    db.delete(credentials).where(and(eq(credentials.listingId, id), isNull(credentials.orderItemId))),
    db.delete(listings).where(eq(listings.id, id)),
  ];
  await db.batch(ops);
  revalidatePath("/admin/listings");
  revalidatePath("/");
}

// ---------- استخر اکانت ----------

export async function addCredentialsAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const listingId = str(formData, "listingId");
  const rows = parseCredentialsText(str(formData, "credentials"));
  if (!listingId) return { error: "لیستینگ نامعتبر است.", fieldErrors: {} };
  if (rows.length === 0) {
    return { error: "چیزی برای افزودن پیدا نشد. هر خط باید به شکل ایمیل:رمز باشد.", fieldErrors: {} };
  }
  const db = await getDb();
  await db.insert(credentials).values(
    rows.map((c) => ({
      id: newId("cred"),
      listingId,
      username: c.username,
      password: c.password,
    }))
  );
  revalidatePath(`/admin/listings/${listingId}`);
  revalidatePath("/admin/listings");
  return { error: null, message: `${rows.length} اکانت اضافه شد.`, fieldErrors: {} };
}

export async function deleteCredentialAction(formData: FormData): Promise<void> {
  const id = str(formData, "id");
  if (!id) return;
  const db = await getDb();
  const cred = await db
    .select({ id: credentials.id, listingId: credentials.listingId, orderItemId: credentials.orderItemId })
    .from(credentials)
    .where(eq(credentials.id, id))
    .get();
  if (!cred || cred.orderItemId) return;
  await db.delete(credentials).where(eq(credentials.id, id));
  revalidatePath(`/admin/listings/${cred.listingId}`);
  revalidatePath("/admin/listings");
}
