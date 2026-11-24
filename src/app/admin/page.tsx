import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";

export default async function AdminPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.role !== "admin") redirect("/");

  return (
    <div className="grid-bg flex-1 pb-20 pt-32">
      <div className="container-x">
        <h1 className="neon-text text-3xl font-black">پنل مدیریت</h1>
        <p className="mt-3 text-slate-400">
          {user.name} عزیز، خوش آمدی! پنل کامل مدیریت (آمار، بازی‌ها، اکانت‌ها، سفارش‌ها و تنظیمات) در گام بعدی
          ساخته می‌شود.
        </p>
      </div>
    </div>
  );
}
