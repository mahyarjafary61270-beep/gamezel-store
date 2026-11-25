import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/session";
import LoginForm from "./login-form";

export default async function LoginPage() {
  const user = await getCurrentUser();
  if (user) redirect(user.role === "admin" ? "/admin" : "/");

  return (
    <div className="grid-bg flex-1 pb-20 pt-32">
      <div className="container-x max-w-md">
        <h1 className="neon-text text-center text-3xl font-black">ورود به گیمزل</h1>
        <p className="mt-3 text-center text-slate-400">به حساب کاربری خود وارد شوید</p>
        <div className="glass card-glow mt-8 rounded-2xl p-8">
          <LoginForm />
          <p className="mt-6 text-center text-sm text-slate-400">
            حساب ندارید؟{" "}
            <Link href="/register" className="font-bold text-neon-mint transition-colors hover:text-emerald-300">
              ثبت‌نام کنید
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
