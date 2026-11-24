import Link from "next/link";
import { asc, count, desc, eq, isNull } from "drizzle-orm";
import DeleteButton from "@/components/admin/DeleteButton";
import { getDb } from "@/db";
import { credentials, games, listings } from "@/db/schema";
import { deleteListingAction } from "@/lib/admin-actions";
import { formatPrice } from "@/lib/format";

export default async function AdminListingsPage({
  searchParams,
}: {
  searchParams: Promise<{ game?: string }>;
}) {
  const { game } = await searchParams;
  const db = await getDb();

  const gameRows = await db
    .select({ id: games.id, title: games.title })
    .from(games)
    .orderBy(asc(games.sortOrder));
  const rows = await db
    .select()
    .from(listings)
    .where(game ? eq(listings.gameId, game) : undefined)
    .orderBy(asc(listings.sortOrder), desc(listings.createdAt));
  const stockRows = await db
    .select({ listingId: credentials.listingId, c: count() })
    .from(credentials)
    .where(isNull(credentials.orderItemId))
    .groupBy(credentials.listingId);

  const gameMap = new Map(gameRows.map((g) => [g.id, g.title]));
  const stockMap = new Map(stockRows.map((r) => [r.listingId, r.c]));

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-xl font-black">اکانت‌ها ({rows.length})</h1>
        <Link href="/admin/listings/new" className="glow-btn !px-5 !py-2.5 text-sm">
          + افزودن اکانت
        </Link>
      </div>

      <div className="flex flex-wrap gap-2">
        <Link
          href="/admin/listings"
          className={`${game ? "btn-sm" : "badge badge-muted"} !px-3 !py-2 text-xs`}
        >
          همه بازی‌ها
        </Link>
        {gameRows.map((g) => (
          <Link
            key={g.id}
            href={`/admin/listings?game=${g.id}`}
            className={`${game === g.id ? "badge badge-muted" : "btn-sm"} !px-3 !py-2 text-xs`}
          >
            {g.title}
          </Link>
        ))}
      </div>

      <div className="admin-card overflow-x-auto">
        <table className="admin-table">
          <thead>
            <tr>
              <th>عنوان</th>
              <th>بازی</th>
              <th>قیمت</th>
              <th>موجودی</th>
              <th>وضعیت</th>
              <th>عملیات</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((l) => (
              <tr key={l.id}>
                <td className="font-bold">{l.title}</td>
                <td className="text-slate-300">{gameMap.get(l.gameId) ?? "—"}</td>
                <td>{formatPrice(l.price)}</td>
                <td>
                  <span className={stockMap.get(l.id) ? "badge badge-success" : "badge badge-danger"}>
                    {stockMap.get(l.id) ?? 0} عدد
                  </span>
                </td>
                <td>
                  {l.isActive ? (
                    <span className="badge badge-success">فعال</span>
                  ) : (
                    <span className="badge badge-muted">غیرفعال</span>
                  )}
                </td>
                <td>
                  <div className="flex items-center gap-2">
                    <Link href={`/admin/listings/${l.id}`} className="btn-sm">
                      ویرایش
                    </Link>
                    <DeleteButton action={deleteListingAction} id={l.id} />
                  </div>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={6} className="py-8 text-center text-slate-400">
                  هنوز اکانتی ثبت نشده است.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
