import Link from "next/link";
import { desc, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { orders, users } from "@/db/schema";
import { formatDate, formatPrice, shortId } from "@/lib/format";

const STATUS_LABEL: Record<string, { label: string; className: string }> = {
  pending: { label: "در انتظار", className: "badge-warning" },
  approved: { label: "تایید شده", className: "badge-success" },
  rejected: { label: "رد شده", className: "badge-danger" },
};

const TABS = [
  { key: "", label: "همه" },
  { key: "pending", label: "در انتظار" },
  { key: "approved", label: "تایید شده" },
  { key: "rejected", label: "رد شده" },
];

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const valid =
    status === "pending" || status === "approved" || status === "rejected" ? status : "";

  const db = await getDb();
  const rows = await db
    .select({
      id: orders.id,
      status: orders.status,
      totalPrice: orders.totalPrice,
      createdAt: orders.createdAt,
      userName: users.name,
    })
    .from(orders)
    .innerJoin(users, eq(orders.userId, users.id))
    .where(valid ? eq(orders.status, valid as "pending" | "approved" | "rejected") : undefined)
    .orderBy(desc(orders.createdAt))
    .limit(200);

  return (
    <div className="space-y-5">
      <h1 className="text-xl font-black">سفارش‌ها ({rows.length})</h1>

      <div className="flex flex-wrap gap-2">
        {TABS.map((t) => (
          <Link
            key={t.key}
            href={t.key ? `/admin/orders?status=${t.key}` : "/admin/orders"}
            className={`${valid === t.key ? "badge badge-muted" : "btn-sm"} !px-3 !py-2 text-xs`}
          >
            {t.label}
          </Link>
        ))}
      </div>

      <div className="admin-card overflow-x-auto">
        <table className="admin-table">
          <thead>
            <tr>
              <th>شماره</th>
              <th>مشتری</th>
              <th>مبلغ</th>
              <th>وضعیت</th>
              <th>تاریخ</th>
              <th>عملیات</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((o) => {
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
                      بررسی
                    </Link>
                  </td>
                </tr>
              );
            })}
            {rows.length === 0 && (
              <tr>
                <td colSpan={6} className="py-8 text-center text-slate-400">
                  سفارشی پیدا نشد.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
