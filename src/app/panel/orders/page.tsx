import Link from "next/link";
import { redirect } from "next/navigation";
import { desc, eq } from "drizzle-orm";
import PanelNav from "@/components/panel/PanelNav";
import { getDb } from "@/db";
import { orders } from "@/db/schema";
import { formatDate, formatPrice, shortId } from "@/lib/format";
import { getCurrentUser } from "@/lib/session";

const STATUS: Record<string, { label: string; className: string }> = {
  pending: { label: "در انتظار", className: "badge-warning" },
  approved: { label: "تایید شده", className: "badge-success" },
  rejected: { label: "رد شده", className: "badge-danger" },
};

export default async function PanelOrdersPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const db = await getDb();
  const myOrders = await db
    .select()
    .from(orders)
    .where(eq(orders.userId, user.id))
    .orderBy(desc(orders.createdAt));

  return (
    <div className="container-x pb-24 pt-28">
      <h1 className="text-2xl font-black text-white sm:text-3xl">
        سفارش‌های <span className="neon-text">من</span>
      </h1>
      <PanelNav active="/panel/orders" />

      {myOrders.length === 0 ? (
        <div className="glass mt-8 rounded-2xl p-10 text-center">
          <p className="text-lg font-bold text-slate-200">هنوز سفارشی ثبت نکردی!</p>
          <Link href="/#store" className="glow-btn mt-6 inline-block !px-6 !py-3 text-sm">
            مشاهده اکانت‌ها
          </Link>
        </div>
      ) : (
        <ul className="mt-8 space-y-3">
          {myOrders.map((o) => {
            const st = STATUS[o.status] ?? STATUS.pending;
            return (
              <li key={o.id}>
                <Link
                  href={`/panel/orders/${o.id}`}
                  className="glass flex flex-wrap items-center justify-between gap-4 rounded-2xl px-5 py-4 transition-colors hover:border-neon-mint/40"
                >
                  <div className="flex items-center gap-4">
                    <span className="font-mono text-sm text-slate-400" dir="ltr">
                      #{shortId(o.id)}
                    </span>
                    <span className="text-sm text-slate-400">{formatDate(o.createdAt)}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-black text-white">{formatPrice(o.totalPrice)}</span>
                    <span className={`badge ${st.className}`}>{st.label}</span>
                    <span className="text-xs font-bold text-neon-mint">جزئیات ←</span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
