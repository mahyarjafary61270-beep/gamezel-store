import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { and, eq, inArray } from "drizzle-orm";
import PanelNav from "@/components/panel/PanelNav";
import { getDb } from "@/db";
import { credentials, listings, orderItems, orders, receipts } from "@/db/schema";
import { formatDate, formatPrice, shortId } from "@/lib/format";
import { getCurrentUser } from "@/lib/session";

const STATUS: Record<string, { label: string; className: string }> = {
  pending: { label: "در انتظار بررسی", className: "badge-warning" },
  approved: { label: "تایید شده", className: "badge-success" },
  rejected: { label: "رد شده", className: "badge-danger" },
};

export default async function PanelOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const db = await getDb();
  const order = await db
    .select()
    .from(orders)
    .where(and(eq(orders.id, id), eq(orders.userId, user.id)))
    .get();
  if (!order) notFound();
  const st = STATUS[order.status] ?? STATUS.pending;

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
    <div className="container-x pb-24 pt-28">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-black text-white sm:text-3xl">
          سفارش <span className="font-mono text-base text-slate-400" dir="ltr">#{shortId(order.id)}</span>
        </h1>
        <Link href="/panel/orders" className="ghost-btn !px-4 !py-2 text-sm">
          بازگشت به لیست
        </Link>
      </div>
      <PanelNav active="/panel/orders" />

      <div className="glass mt-6 rounded-2xl p-6">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
          <span className={`badge ${st.className}`}>{st.label}</span>
          <span className="text-slate-400">{formatDate(order.createdAt)}</span>
          <span>
            مبلغ کل: <b className="text-neon-mint">{formatPrice(order.totalPrice)}</b>
          </span>
        </div>

        {order.status === "pending" && (
          <p className="mt-4 rounded-xl border border-amber-400/20 bg-amber-500/10 px-4 py-3 text-sm leading-7 text-amber-200">
            رسید پرداختت توسط ادمین در حال بررسی است. به‌محض تایید، اطلاعات اکانت
            همین‌جا نمایش داده می‌شود.
          </p>
        )}
        {order.status === "rejected" && (
          <p className="mt-4 rounded-xl border border-rose-400/20 bg-rose-500/10 px-4 py-3 text-sm leading-7 text-rose-300">
            این سفارش رد شده است. برای پیگیری با پشتیبانی در ارتباط باش.
          </p>
        )}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
        <section className="glass rounded-2xl p-6">
          <h2 className="text-lg font-black text-white">اقلام سفارش</h2>
          <ul className="mt-4 divide-y divide-white/5">
            {items.map((item) => {
              const creds = credsByItem.get(item.id) ?? [];
              return (
                <li key={item.id} className="py-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="font-bold text-white">{item.listingTitle}</p>
                      <p className="mt-1 text-sm text-slate-400">
                        {formatPrice(item.priceEach)} × {item.quantity.toLocaleString("fa-IR")}
                      </p>
                    </div>
                    <span className="font-black text-white">
                      {formatPrice(item.priceEach * item.quantity)}
                    </span>
                  </div>

                  {order.status === "approved" && (
                    <div className="mt-4">
                      {creds.length > 0 ? (
                        <div className="space-y-2">
                          <p className="text-xs font-bold text-emerald-300">
                            اطلاعات اکانت تحویلی:
                          </p>
                          {creds.map((c, i) => (
                            <div
                              key={i}
                              className="rounded-xl border border-emerald-400/20 bg-emerald-500/5 px-4 py-3"
                            >
                              <div className="flex flex-wrap items-center gap-2 text-sm">
                                <span className="text-slate-400">یوزرنیم:</span>
                                <span className="font-mono font-bold text-teal-200" dir="ltr">
                                  {c.username}
                                </span>
                              </div>
                              <div className="mt-1.5 flex flex-wrap items-center gap-2 text-sm">
                                <span className="text-slate-400">رمز عبور:</span>
                                <span className="font-mono font-bold text-white" dir="ltr">
                                  {c.password}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-slate-500">اطلاعات اکانت به‌زودی ثبت می‌شود.</p>
                      )}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </section>

        <aside className="h-fit space-y-6">
          {receiptRows.length > 0 && (
            <section className="glass rounded-2xl p-6">
              <h2 className="text-lg font-black text-white">رسید پرداخت</h2>
              <div className="mt-4 space-y-3">
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
                      className="h-40 w-full object-contain"
                    />
                  </a>
                ))}
              </div>
            </section>
          )}

          <section className="glass rounded-2xl p-6 text-sm leading-7 text-slate-300">
            <h2 className="mb-2 text-lg font-black text-white">نیاز به کمک داری؟</h2>
            اگه سوالی درباره سفارشت داری، از طریق تلگرام پشتیبانی پیام بده — شماره سفارش
            را هم بفرست تا سریع‌تر بررسی کنیم.
          </section>
        </aside>
      </div>
    </div>
  );
}
