"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { and, count, eq, inArray, isNull } from "drizzle-orm";
import { getDb } from "@/db";
import { credentials, listings, orderItems, orders, receipts } from "@/db/schema";
import { newId } from "@/lib/format";
import { MAX_IMAGE_BYTES, parseDataUrl } from "@/lib/image-utils";
import { getCurrentUser } from "@/lib/session";

export type CreateOrderState = { error: string | null };

type CartPayload = { listingId: string; quantity: number };

export async function createOrderAction(
  _prev: CreateOrderState,
  formData: FormData
): Promise<CreateOrderState> {
  const user = await getCurrentUser();
  if (!user) return { error: "ابتدا وارد حساب خود شوید." };

  let items: CartPayload[];
  try {
    const parsed = JSON.parse(String(formData.get("items") ?? "[]"));
    if (!Array.isArray(parsed) || parsed.length === 0) {
      return { error: "سبد خرید خالی است." };
    }
    items = parsed.map((i) => ({
      listingId: String(i.listingId ?? ""),
      quantity: Math.max(1, Math.floor(Number(i.quantity) || 1)),
    }));
  } catch {
    return { error: "اطلاعات سبد خرید نامعتبر است." };
  }
  if (items.length > 20) return { error: "تعداد آیتم‌های سفارش بیش از حد مجاز است." };

  const receiptUrls = formData
    .getAll("receipts")
    .map(String)
    .filter((s) => s.length > 0);
  if (receiptUrls.length === 0) return { error: "عکس رسید پرداخت را آپلود کنید." };
  if (receiptUrls.length > 3) return { error: "حداکثر ۳ تصویر رسید مجاز است." };

  const parsedReceipts = [];
  for (const url of receiptUrls) {
    const parsed = parseDataUrl(url);
    if (!parsed) return { error: "فرمت یکی از تصاویر رسید معتبر نیست." };
    if (parsed.bytes.length > MAX_IMAGE_BYTES) {
      return { error: "حجم یکی از تصاویر رسید بیش از حد مجاز است." };
    }
    parsedReceipts.push(parsed);
  }

  const db = await getDb();

  const listingIds = items.map((i) => i.listingId);
  const listingRows = await db
    .select({
      id: listings.id,
      title: listings.title,
      price: listings.price,
    })
    .from(listings)
    .where(and(eq(listings.isActive, true), inArray(listings.id, listingIds)));

  const byId = new Map(listingRows.map((r) => [r.id, r]));
  for (const item of items) {
    const l = byId.get(item.listingId);
    if (!l) return { error: "یکی از اکانت‌های سفارش دیگر موجود نیست. سبد را به‌روز کنید." };
  }

  const stockRows = await db
    .select({ listingId: credentials.listingId, count: count() })
    .from(credentials)
    .where(and(isNull(credentials.orderItemId), inArray(credentials.listingId, listingIds)))
    .groupBy(credentials.listingId);
  const stockByListing = new Map(stockRows.map((s) => [s.listingId, s.count]));

  for (const item of items) {
    const l = byId.get(item.listingId)!;
    const stock = stockByListing.get(l.id) ?? 0;
    if (stock < item.quantity) {
      return {
        error: `موجودی «${l.title}» کافی نیست (موجود: ${stock.toLocaleString("fa-IR")} عدد).`,
      };
    }
  }

  const totalPrice = items.reduce(
    (sum, item) => sum + byId.get(item.listingId)!.price * item.quantity,
    0
  );

  const orderId = newId("ord");
  const now = new Date();
  await db.insert(orders).values({
    id: orderId,
    userId: user.id,
    status: "pending",
    totalPrice,
    createdAt: now,
    updatedAt: now,
  });
  await db.insert(orderItems).values(
    items.map((item) => ({
      id: newId("oi"),
      orderId,
      listingId: item.listingId,
      quantity: item.quantity,
      priceEach: byId.get(item.listingId)!.price,
    }))
  );
  if (parsedReceipts.length > 0) {
    await db.insert(receipts).values(
      parsedReceipts.map((r) => ({
        id: newId("rcp"),
        orderId,
        mime: r.mime,
        data: r.bytes,
      }))
    );
  }

  revalidatePath("/admin/orders");
  redirect(`/checkout/success?order=${orderId}`);
}
