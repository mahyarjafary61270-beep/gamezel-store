import Link from "next/link";
import { notFound } from "next/navigation";
import { eq, inArray } from "drizzle-orm";
import OrderActions from "@/components/admin/OrderActions";
import { getDb } from "@/db";
import { credentials, listings, orderItems, orders, receipts, users } from "@/db/schema";
import { formatDate, formatPrice, shortId } from "@/lib/format";

const STATUS_LABEL: Record<string, { label: string; className: string }> = {
  pending: { label: "در انتظار بررسی", className: "badge-warning" },
  approved: { label: "تایید شده", className: "badge-success" },
  rejected: { label: "رد شده", className: "badge-danger" },
};

export default async function AdminOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = await getDb();

  const order = await db.select().from(orders).where(eq(orders.id, id)).get();
  if (!order) notFound();
  const st = STATUS_LABEL[order.status];

  const buyer = await db
    .select({ name: users.name, email: users.email })
    .from(users)
    .where(eq(users.id, order.userId))
    .get();

  const items = await db
    .select({
      id: orderItems.id,
      quantity: orderItems.quantity,
      priceEach: orderItems.priceEach,
      listingTitle: listings.title,
    })
    .from(orderItems)
    .innerJoin(listings, eq(orderItems.listingId, listings.id))
    .where(eq(orderItems.orderId, id));

  const receiptRows = await db
    .select({ id: receipts.id })
    .from(receipts)
    .where(eq(receipts.orderId, id));

  const itemIds = items.map((i) => i.id);
  const credRows = itemIds.length
    ? await db
        .select({
          id: credentials.id,
          orderItemId: credentials.orderItemId,
          username: credentials.username,
          password: credentials.password,
        })
        .from(credentials)
        .where(inArray(credentials.orderItemId, itemIds))
    : [];

  const credsByItem = new Map<string, { username: string; password: string }[]>();
  for (const c of credRows) {
    if (!c.orderItemId) continue;
    const arr = credsByItem.get(c.orderItemId) ?? [];
    arr.push({ username: c.username, password: c.password });
    credsByItem.set(c.orderItemId, arr);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-black">
          سفارش <span className="font-mono text-base" dir="ltr">#{shortId(order.id)}</span>
        </h1>
        <Link href="/admin/orders" className="ghost-btn !px-4 !py-2 text-sm">
          بازگشت به لیست
        </Link>
      </div>

      <div className="admin-card space-y-3">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
          <span className={`badge ${st.className}`}>{st.label}</span>
          <span className="text-sm text-slate-400">{formatDate(order.createdAt)}</span>
          <span className="text-sm">
            مشتری: <b>{buyer?.name ?? "—"}</b>
            <span className="mr-2 text-xs text-slate-400" dir="ltr">({buyer?.email ?? "—"})</span>
          </span>
          <span className="text-sm">
            مبلغ کل: <b className="text-neon-cyan">{formatPrice(order.totalPrice)}</b>
          </span>
        </div>
        {order.status === "pending" && <OrderActions orderId={order.id} />}
      </div>

      {receiptRows.length > 0 && (
        <div className="admin-card">
          <h2 className="mb-3 font-black">رسید پرداخت</h2>
          <div className="flex flex-wrap gap-3">
            {receiptRows.map((r) => (
              <a
                key={r.id}
                href={`/api/receipts/${r.id}`}
                target="_blank"
                rel="noreferrer"
                className="block overflow-hidden rounded-xl border border-white/10 transition-transform hover:scale-[1.02]"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`/api/receipts/${r.id}`}
                  alt="رسید پرداخت"
                  className="h-40 w-auto object-contain"
                />
              </a>
            ))}
          </div>
        </div>
      )}

      <div className="admin-card overflow-x-auto">
        <h2 className="mb-3 font-black">اقلام سفارش</h2>
        <table className="admin-table">
          <thead>
            <tr>
              <th>اکانت</th>
              <th>تعداد</th>
              <th>قیمت واحد</th>
              <th>جمع</th>
              <th>اکانت‌های تحویلی</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => {
              const creds = credsByItem.get(item.id) ?? [];
              return (
                <tr key={item.id} className="align-top">
                  <td className="font-bold">{item.listingTitle}</td>
                  <td>{item.quantity}</td>
                  <td>{formatPrice(item.priceEach)}</td>
                  <td>{formatPrice(item.priceEach * item.quantity)}</td>
                  <td>
                    {order.status === "approved" ? (
                      creds.length > 0 ? (
                        <div className="space-y-1.5">
                          {creds.map((c, i) => (
                            <div
                              key={i}
                              className="rounded-lg border border-emerald-400/20 bg-emerald-500/5 px-2.5 py-1.5"
                            >
                              <p className="font-mono text-xs text-cyan-200" dir="ltr">{c.username}</p>
                              <p className="font-mono text-xs text-slate-400" dir="ltr">{c.password}</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className="text-xs text-slate-500">—</span>
                      )
                    ) : (
                      <span className="text-xs text-slate-500">پس از تایید نمایش داده می‌شود</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
