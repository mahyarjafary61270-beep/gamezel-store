import { desc } from "drizzle-orm";
import RoleSelect from "@/components/admin/RoleSelect";
import { getDb } from "@/db";
import { users } from "@/db/schema";
import { formatDate } from "@/lib/format";
import { getCurrentUser } from "@/lib/session";

export default async function AdminUsersPage() {
  const db = await getDb();
  const current = await getCurrentUser();
  const rows = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      role: users.role,
      createdAt: users.createdAt,
    })
    .from(users)
    .orderBy(desc(users.createdAt));

  return (
    <div className="space-y-5">
      <h1 className="text-xl font-black">کاربران ({rows.length})</h1>
      <div className="admin-card overflow-x-auto">
        <table className="admin-table">
          <thead>
            <tr>
              <th>نام</th>
              <th>ایمیل</th>
              <th>نقش</th>
              <th>تاریخ عضویت</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((u) => (
              <tr key={u.id}>
                <td className="font-bold">
                  {u.name}
                  {u.id === current?.id && <span className="badge badge-muted mr-2">شما</span>}
                </td>
                <td className="text-slate-300" dir="ltr">
                  {u.email}
                </td>
                <td>
                  <RoleSelect userId={u.id} currentRole={u.role} self={u.id === current?.id} />
                </td>
                <td className="text-slate-400">{formatDate(u.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
