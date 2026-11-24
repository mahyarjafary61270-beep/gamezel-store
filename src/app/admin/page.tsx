import Link from "next/link";
import { count, desc, eq, isNull, sql } from "drizzle-orm";
import { getDb } from "@/db";
import { credentials, games, listings, orders, users } from "@/db/schema";
import { formatDate, formatPrice, shortId } from "@/lib/format";

const STATUS_LABEL: Record<string, { label: string; className: string }> = {
  pending: { label: "در انتظار", className: "badge-warning" },
  approved: { label: "تایید شده", className: "badge-success" },
  rejected: { label: "رد شده", className: "badge-danger" },
};

export default async function AdminDashboard() {
  const db = await getDb();

  const [gamesCount] = await db.select({ c: count() }).from(games);
  const [listingsCount] = await db.select({ c: count() }).from(listings);
  const [stockCount] = await db
    .select({ c: count() })
    .from(credentials)
    .where(isNull(credentials.orderItemId));
  const [pendingCount] = await db
    .select({ c: count() })
    .from(orders)
    .where(eq(orders.status, "pending"));
  const [usersCount] = await db.select({ c: count() }).from(users);
  const [revenue] = await db
    .select({ total: sql<number>`coalesce(sum(${orders.totalPrice}), 0)` })
    .from(orders)
    .where(eq(orders.status, "approved"));

  const recent = await db
    .select({
      id: orders.id,
      totalPrice: orders.totalPrice,
      status: orders.status,
      createdAt: orders.createdAt,
      userName: users.name,
    })
    .from(orders)
    .innerJoin(users, eq(orders.userId, users.id))
    .orderBy(desc(orders.createdAt))
    .limit(6);

  const stats = [
    { label: "بازی‌ها", value: gamesCount.c },
    { label: "اکانت‌های فعال", value: listingsCount.c },
    { label: "موجودی اکانت", value: stockCount.c },
    { label: "سفارش‌های در انتظار", value: pendingCount.c },
    { label: "کاربران", value: usersCount.c },
    { label: "درآمد کل", value: formatPrice(Number(revenue?.total ?? 0)) },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-black">داشبورد</h1>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
        {stats.map((s) => (
          <div key={s.label} className="admin-card !p-4">
            <p className="text-xs text-slate-400">{s.label}</p>
            <p className="mt-1.5 text-xl font-black text-white">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="admin-card">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-black">آخرین سفارش‌ها</h2>
          <Link href="/admin/orders" className="btn-sm">
            همه سفارش‌ها
          </Link>
        </div>
        {recent.length === 0 ? (
          <p className="text-sm text-slate-400">هنوز سفارشی ثبت نشده است.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>شماره</th>
                  <th>مشتری</th>
                  <th>مبلغ</th>
                  <th>وضعیت</th>
                  <th>تاریخ</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {recent.map((o) => {
                  const st = STATUS_LABEL[o.status];
                  return (
                    <tr key={o.id}>
                      <td className="font-mono text-xs" dir="ltr">
                        #{shortId(o.id)}
                      </td>
                      <td className="font-bold">{o.userName}</td>
                      <td>{formatPrice(o.totalPrice)}</td>
                      <td>
                        <span className={`badge ${st.className}`}>{st.label}</span>
                      </td>
                      <td className="text-slate-400">{formatDate(o.createdAt)}</td>
                      <td>
                        <Link href={`/admin/orders/${o.id}`} className="btn-sm">
                          مشاهده
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
