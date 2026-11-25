import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-x grid min-h-[60vh] place-items-center pb-24 pt-28 text-center">
      <div>
        <p dir="ltr" className="neon-text text-8xl font-black tracking-tighter">
          404
        </p>
        <h1 className="mt-4 text-2xl font-black text-white sm:text-3xl">
          صفحه پیدا نشد!
        </h1>
        <p className="mx-auto mt-3 max-w-md text-slate-400">
          صفحه‌ای که دنبالشی وجود نداره یا حذف شده. از لینک‌های زیر می‌تونی به
          فروشگاه برگردی.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link href="/" className="glow-btn !px-6 !py-2.5 text-sm">
            بازگشت به خانه
          </Link>
          <Link href="/#store" className="ghost-btn !px-6 !py-2.5 text-sm">
            مشاهده بازی‌ها
          </Link>
        </div>
      </div>
    </div>
  );
}
