import Link from "next/link";
import { asc } from "drizzle-orm";
import CategoryForm from "@/components/admin/CategoryForm";
import DeleteButton from "@/components/admin/DeleteButton";
import { getDb } from "@/db";
import { categories } from "@/db/schema";
import { deleteCategoryAction } from "@/lib/admin-actions";

export default async function AdminCategoriesPage({
  searchParams,
}: {
  searchParams: Promise<{ edit?: string }>;
}) {
  const { edit } = await searchParams;
  const db = await getDb();
  const rows = await db.select().from(categories).orderBy(asc(categories.sortOrder));
  const editing = edit ? (rows.find((c) => c.id === edit) ?? null) : null;

  return (
    <div className="space-y-5">
      <h1 className="text-xl font-black">دسته‌بندی‌ها ({rows.length})</h1>
      <CategoryForm category={editing} />
      <div className="admin-card overflow-x-auto">
        <table className="admin-table">
          <thead>
            <tr>
              <th>نام</th>
              <th>اسلاگ</th>
              <th>ترتیب</th>
              <th>عملیات</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((c) => (
              <tr key={c.id}>
                <td className="font-bold">{c.name}</td>
                <td className="font-mono text-xs text-slate-400" dir="ltr">
                  {c.slug}
                </td>
                <td>{c.sortOrder}</td>
                <td>
                  <div className="flex items-center gap-2">
                    <Link href={`/admin/categories?edit=${c.id}`} className="btn-sm">
                      ویرایش
                    </Link>
                    <DeleteButton action={deleteCategoryAction} id={c.id} />
                  </div>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={4} className="py-8 text-center text-slate-400">
                  هنوز دسته‌ای ثبت نشده است.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
