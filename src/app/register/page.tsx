import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/session";
import RegisterForm from "./register-form";

export default async function RegisterPage() {
  const user = await getCurrentUser();
  if (user) redirect(user.role === "admin" ? "/admin" : "/");

  return (
    <div className="grid-bg flex-1 pb-20 pt-32">
      <div className="container-x max-w-md">
        <h1 className="neon-text text-center text-3xl font-black">ساخت حساب در گیمزل</h1>
        <p className="mt-3 text-center text-slate-400">ثبت‌نام فقط ۳۰ ثانیه طول می‌کشد</p>
        <div className="glass card-glow mt-8 rounded-2xl p-8">
          <RegisterForm />
          <p className="mt-6 text-center text-sm text-slate-400">
            قبلا ثبت‌نام کرده‌اید؟{" "}
            <Link href="/login" className="font-bold text-neon-cyan transition-colors hover:text-cyan-300">
              وارد شوید
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
