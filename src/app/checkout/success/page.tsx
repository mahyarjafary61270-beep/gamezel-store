import { notFound } from "next/navigation";
import Link from "next/link";
import { eq } from "drizzle-orm";
import ClearCart from "@/components/checkout/ClearCart";
import { getDb } from "@/db";
import { listings, orderItems, orders } from "@/db/schema";
import { formatDate, formatPrice, shortId } from "@/lib/format";
import { getCurrentUser } from "@/lib/session";

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string }>;
}) {
  const { order } = await searchParams;
  if (!order) notFound();

  const user = await getCurrentUser();
  if (!user) notFound();

  const db = await getDb();
  const [orderRow] = await db
    .select()
    .from(orders)
    .where(eq(orders.id, order))
    .limit(1);
  if (!orderRow || orderRow.userId !== user.id) notFound();

  const rows = await db
    .select({
      title: listings.title,
      quantity: orderItems.quantity,
      priceEach: orderItems.priceEach,
    })
    .from(orderItems)
    .innerJoin(listings, eq(listings.id, orderItems.listingId))
    .where(eq(orderItems.orderId, orderRow.id));

  return (
    <div className="container-x flex justify-center pb-24 pt-28">
      <div className="glass w-full max-w-xl rounded-2xl p-8 text-center">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full border border-emerald-400/30 bg-emerald-500/10">
          <svg viewBox="0 0 24 24" className="h-8 w-8 text-emerald-300" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="mt-5 text-2xl font-black text-white">سفارش ثبت شد!</h1>
        <p className="mt-3 text-sm leading-7 text-slate-400">
          سفارش <span dir="ltr" className="font-bold text-neon-cyan">{shortId(orderRow.id)}</span> با
          موفقیت ثبت شد و در صف بررسی قرار گرفت. بعد از تایید رسید توسط ادمین، اطلاعات
          اکانت در پنل کاربری‌ات قرار می‌گیرد.
        </p>

        <ul className="mt-6 space-y-2 rounded-xl border border-white/10 bg-black/20 p-4 text-sm">
          {rows.map((r, i) => (
            <li key={i} className="flex items-center justify-between gap-3">
              <span className="min-w-0 truncate text-slate-300">
                {r.title}{" "}
                <span className="text-slate-500">× {r.quantity.toLocaleString("fa-IR")}</span>
              </span>
              <span className="shrink-0 font-bold text-white">
                {formatPrice(r.priceEach * r.quantity)}
              </span>
            </li>
          ))}
        </ul>

        <dl className="mt-4 flex items-center justify-between text-sm">
          <dt className="text-slate-400">
            وضعیت: <span className="badge badge-warning">در انتظار بررسی</span>
          </dt>
          <dd className="font-black text-neon-cyan">{formatPrice(orderRow.totalPrice)}</dd>
        </dl>
        <p className="mt-3 text-xs text-slate-500">{formatDate(orderRow.createdAt)}</p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href={`/panel/orders/${orderRow.id}`}
            className="glow-btn !px-6 !py-3 text-sm"
          >
            مشاهده سفارش در پنل کاربری
          </Link>
          <Link href="/#games" className="ghost-btn !px-6 !py-3 text-sm">
            بازگشت به فروشگاه
          </Link>
        </div>
      </div>
      <ClearCart />
    </div>
  );
}
