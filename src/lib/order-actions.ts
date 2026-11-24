"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { and, eq, isNull } from "drizzle-orm";
import { getDb } from "@/db";
import { credentials, listings, orderItems, orders } from "@/db/schema";

export type OrderActionState = { error: string | null };

export async function approveOrderAction(_prev: OrderActionState, formData: FormData): Promise<OrderActionState> {
  const orderId = String(formData.get("orderId") ?? "");
  if (!orderId) return { error: "سفارش نامعتبر است." };
  const db = await getDb();

  const order = await db
    .select({ id: orders.id, status: orders.status })
    .from(orders)
    .where(eq(orders.id, orderId))
    .get();
  if (!order) return { error: "سفارش پیدا نشد." };
  if (order.status !== "pending") return { error: "این سفارش قبلا بررسی شده است." };

  const items = await db
    .select({ id: orderItems.id, listingId: orderItems.listingId, quantity: orderItems.quantity })
    .from(orderItems)
    .where(eq(orderItems.orderId, orderId));
  if (items.length === 0) return { error: "این سفارش آیتمی ندارد." };

  const updates: { credentialId: string; itemId: string }[] = [];
  for (const item of items) {
    const available = await db
      .select({ id: credentials.id, listingTitle: listings.title })
      .from(credentials)
      .innerJoin(listings, eq(credentials.listingId, listings.id))
      .where(and(eq(credentials.listingId, item.listingId), isNull(credentials.orderItemId)))
      .limit(item.quantity);
    if (available.length < item.quantity) {
      const title = available[0]?.listingTitle ?? "نامشخص";
      return {
        error: `موجودی اکانت «${title}» کافی نیست (نیاز: ${item.quantity}، موجود: ${available.length}).`,
      };
    }
    for (const c of available) updates.push({ credentialId: c.id, itemId: item.id });
  }

  const ops = [
    ...updates.map((u) =>
      db.update(credentials).set({ orderItemId: u.itemId }).where(eq(credentials.id, u.credentialId))
    ),
    db.update(orders).set({ status: "approved", updatedAt: new Date() }).where(eq(orders.id, orderId)),
  ];
  await db.batch(ops as unknown as Parameters<typeof db.batch>[0]);

  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${orderId}`);
  revalidatePath("/");
  redirect("/admin/orders");
}

export async function rejectOrderAction(_prev: OrderActionState, formData: FormData): Promise<OrderActionState> {
  const orderId = String(formData.get("orderId") ?? "");
  if (!orderId) return { error: "سفارش نامعتبر است." };
  const db = await getDb();

  const order = await db
    .select({ id: orders.id, status: orders.status })
    .from(orders)
    .where(eq(orders.id, orderId))
    .get();
  if (!order) return { error: "سفارش پیدا نشد." };
  if (order.status !== "pending") return { error: "این سفارش قبلا بررسی شده است." };

  await db.update(orders).set({ status: "rejected", updatedAt: new Date() }).where(eq(orders.id, orderId));
  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${orderId}`);
  revalidatePath("/");
  redirect("/admin/orders");
}
