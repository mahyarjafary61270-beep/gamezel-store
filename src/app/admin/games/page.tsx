import Link from "next/link";
import { asc, eq } from "drizzle-orm";
import DeleteButton from "@/components/admin/DeleteButton";
import { getDb } from "@/db";
import { categories, games, images } from "@/db/schema";
import { deleteGameAction } from "@/lib/admin-actions";

export default async function AdminGamesPage() {
  const db = await getDb();
  const gameRows = await db.select().from(games).orderBy(asc(games.sortOrder), asc(games.createdAt));
  const catRows = await db.select({ id: categories.id, name: categories.name }).from(categories);
  const imgRows = await db
    .select({ id: images.id, ownerId: images.ownerId })
    .from(images)
    .where(eq(images.ownerType, "game"))
    .orderBy(asc(images.sortOrder));

  const catMap = new Map(catRows.map((c) => [c.id, c.name]));
  const firstImg = new Map<string, string>();
  for (const img of imgRows) {
    if (!firstImg.has(img.ownerId)) firstImg.set(img.ownerId, img.id);
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-xl font-black">بازی‌ها ({gameRows.length})</h1>
        <Link href="/admin/games/new" className="glow-btn !px-5 !py-2.5 text-sm">
          + افزودن بازی
        </Link>
      </div>
      <div className="admin-card overflow-x-auto">
        <table className="admin-table">
          <thead>
            <tr>
              <th>تصویر</th>
              <th>بازی</th>
              <th>دسته‌بندی</th>
              <th>وضعیت</th>
              <th>ترتیب</th>
              <th>عملیات</th>
            </tr>
          </thead>
          <tbody>
            {gameRows.map((g) => {
              const imgId = firstImg.get(g.id);
              return (
                <tr key={g.id}>
                  <td>
                    {imgId ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={`/api/images/${imgId}`}
                        alt={g.title}
                        className="h-12 w-20 rounded-lg border border-white/10 object-cover"
                      />
                    ) : (
                      <span className="grid h-12 w-20 place-items-center rounded-lg border border-dashed border-white/15 text-[10px] text-slate-500">
                        بدون تصویر
                      </span>
                    )}
                  </td>
                  <td>
                    <p className="font-bold">{g.title}</p>
                    <p className="text-xs text-slate-400" dir="ltr">
                      {g.englishTitle}
                    </p>
                  </td>
                  <td className="text-slate-300">{g.categoryId ? (catMap.get(g.categoryId) ?? "—") : "—"}</td>
                  <td>
                    {g.isActive ? (
                      <span className="badge badge-success">فعال</span>
                    ) : (
                      <span className="badge badge-muted">غیرفعال</span>
                    )}
                  </td>
                  <td>{g.sortOrder}</td>
                  <td>
                    <div className="flex items-center gap-2">
                      <Link href={`/admin/games/${g.id}`} className="btn-sm">
                        ویرایش
                      </Link>
                      <DeleteButton action={deleteGameAction} id={g.id} />
                    </div>
                  </td>
                </tr>
              );
            })}
            {gameRows.length === 0 && (
              <tr>
                <td colSpan={6} className="py-8 text-center text-slate-400">
                  هنوز بازی‌ای ثبت نشده است.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
