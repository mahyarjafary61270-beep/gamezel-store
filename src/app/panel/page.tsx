import Link from "next/link";
import { redirect } from "next/navigation";
import { desc, eq } from "drizzle-orm";
import PanelNav from "@/components/panel/PanelNav";
import { getDb } from "@/db";
import { orders } from "@/db/schema";
import { formatDate, formatPrice, shortId } from "@/lib/format";
import { getCurrentUser } from "@/lib/session";

export default async function PanelPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const db = await getDb();
  const myOrders = await db
    .select()
    .from(orders)
    .where(eq(orders.userId, user.id))
    .orderBy(desc(orders.createdAt));

  const approved = myOrders.filter((o) => o.status === "approved");
  const totalSpent = approved.reduce((sum, o) => sum + o.totalPrice, 0);

  return (
    <div className="container-x pb-24 pt-28">
      <h1 className="text-2xl font-black text-white sm:text-3xl">
        پنل <span className="neon-text">کاربری</span>
      </h1>
      <PanelNav active="/panel" />

      <div className="mt-8 grid gap-6 lg:grid-cols-[320px_1fr]">
        <aside className="glass h-fit rounded-2xl p-6">
          <div className="flex items-center gap-4">
            <span className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-violet-600 to-cyan-500 text-xl font-black text-white">
              {user.name.slice(0, 1)}
            </span>
            <div className="min-w-0">
              <p className="truncate font-black text-white">{user.name}</p>
              <p className="mt-1 truncate text-xs text-slate-400" dir="ltr">
                {user.email}
              </p>
            </div>
          </div>
          <dl className="mt-6 space-y-3 border-t border-white/10 pt-5 text-sm">
            <div className="flex items-center justify-between">
              <dt className="text-slate-400">عضویت</dt>
              <dd className="font-bold text-white">{formatDate(user.createdAt)}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-slate-400">تعداد سفارش‌ها</dt>
              <dd className="font-bold text-white">
                {myOrders.length.toLocaleString("fa-IR")} سفارش
              </dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-slate-400">سفارش تاییدشده</dt>
              <dd className="font-bold text-emerald-300">
                {approved.length.toLocaleString("fa-IR")} سفارش
              </dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-slate-400">مجموع خریدها</dt>
              <dd className="font-black text-neon-cyan">{formatPrice(totalSpent)}</dd>
            </div>
          </dl>
        </aside>

        <div className="space-y-6">
          <section className="glass rounded-2xl p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-lg font-black text-white">آخرین سفارش‌ها</h2>
              <Link href="/panel/orders" className="text-sm font-bold text-neon-cyan hover:underline">
                مشاهده همه
              </Link>
            </div>

            {myOrders.length === 0 ? (
              <div className="mt-6 rounded-xl border border-white/10 bg-black/20 p-8 text-center">
                <p className="font-bold text-slate-200">هنوز سفارشی ثبت نکردی!</p>
                <p className="mt-2 text-sm text-slate-400">
                  از فروشگاه یه اکانت انتخاب کن — بعد از تایید پرداخت اینجا تحویل می‌گیری.
                </p>
                <Link href="/#games" className="glow-btn mt-5 inline-block !px-6 !py-3 text-sm">
                  مشاهده اکانت‌ها
                </Link>
              </div>
            ) : (
              <ul className="mt-4 divide-y divide-white/5">
                {myOrders.slice(0, 5).map((o) => (
                  <li key={o.id}>
                    <Link
                      href={`/panel/orders/${o.id}`}
                      className="flex flex-wrap items-center justify-between gap-3 rounded-xl px-3 py-4 transition-colors hover:bg-white/5"
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs text-slate-400" dir="ltr">
                          #{shortId(o.id)}
                        </span>
                        <span className="text-sm text-slate-400">{formatDate(o.createdAt)}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-white">{formatPrice(o.totalPrice)}</span>
                        <span
                          className={`badge ${
                            o.status === "pending"
                              ? "badge-warning"
                              : o.status === "approved"
                                ? "badge-success"
                                : "badge-danger"
                          }`}
                        >
                          {o.status === "pending"
                            ? "در انتظار"
                            : o.status === "approved"
                              ? "تایید شده"
                              : "رد شده"}
                        </span>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="glass rounded-2xl p-6 text-sm leading-7 text-slate-300">
            <h2 className="mb-2 text-lg font-black text-white">راهنما</h2>
            سفارش ثبت می‌کنی، رسید کارت‌به‌کارت را آپلود می‌کنی و بعد از تایید ادمین،
            اطلاعات اکانت (یوزرنیم و رمز) همین‌جا در صفحه جزئیات سفارش نمایش داده می‌شود.
          </section>
        </div>
      </div>
    </div>
  );
}
