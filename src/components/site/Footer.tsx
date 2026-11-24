import Link from "next/link";

const QUICK_LINKS = [
  { href: "/#games", label: "فروشگاه بازی‌ها" },
  { href: "/#features", label: "چرا گیمزل؟" },
  { href: "/#about", label: "درباره ما" },
  { href: "/#faq", label: "سوالات متداول" },
];

const GAMES = [
  { href: "/#games", label: "اکانت دوتا ۲" },
  { href: "/#games", label: "اکانت GTA V" },
  { href: "/#games", label: "اکانت FC 27" },
  { href: "/#games", label: "اکانت ولورانت" },
];

export default function Footer() {
  return (
    <footer className="relative border-t border-white/5 bg-night-900/60">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-l from-transparent via-violet-500/60 to-transparent" />
      <div className="container-x grid gap-10 py-14 md:grid-cols-3">
        <div className="space-y-4">
          <div className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-violet-600 to-cyan-500 shadow-[0_0_18px_rgba(139,92,246,0.55)]">
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5 text-white"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <path d="M6 11h4M8 9v4" />
                <circle cx="15.5" cy="10.5" r="0.8" fill="currentColor" />
                <circle cx="18" cy="13" r="0.8" fill="currentColor" />
                <path d="M17.32 5H6.68a4 4 0 0 0-3.98 3.6L2 15.5A4 4 0 0 0 6 20h12a4 4 0 0 0 4-4.5l-.7-6.9A4 4 0 0 0 17.32 5Z" />
              </svg>
            </span>
            <span className="neon-text text-xl font-black">گیمزل</span>
          </div>
          <p className="text-sm leading-7 text-slate-400">
            فروشگاه تخصصی اکانت‌های اورجینال بازی؛ تحویل فوری، پشتیبانی واقعی و
            ضمانت بازگشت وجه. بازی‌ت رو از گیمزل شروع کن.
          </p>
          <div className="flex items-center gap-3">
            <a
              href="#"
              aria-label="تلگرام"
              className="glass grid h-10 w-10 place-items-center rounded-xl text-slate-300 transition-all hover:-translate-y-1 hover:text-sky-400"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5"
                fill="currentColor"
              >
                <path d="M21.9 4.6 18.9 19c-.2 1-.8 1.2-1.7.8l-4.6-3.4-2.2 2.1c-.3.3-.5.5-.9.5l.3-4.7L18.3 6c.4-.3-.1-.5-.6-.2L7.3 13.4l-4.5-1.4c-1-.3-1-1 .2-1.4L20.6 3.2c.8-.3 1.5.2 1.3 1.4Z" />
              </svg>
            </a>
            <a
              href="#"
              aria-label="اینستاگرام"
              className="glass grid h-10 w-10 place-items-center rounded-xl text-slate-300 transition-all hover:-translate-y-1 hover:text-pink-400"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" />
              </svg>
            </a>
            <a
              href="#"
              aria-label="دیسکورد"
              className="glass grid h-10 w-10 place-items-center rounded-xl text-slate-300 transition-all hover:-translate-y-1 hover:text-indigo-400"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                <path d="M19.3 5.6A17 17 0 0 0 15 4.3l-.2.4a15.7 15.7 0 0 1 4.1 2c-3.4-1.7-7-1.7-10.4 0a15.7 15.7 0 0 1 4.2-2L12.4 4a17 17 0 0 0-4.3 1.3C5.4 9.6 4.7 13.6 5 17.4A17 17 0 0 0 10.2 20l.9-1.4c-.7-.3-1.3-.6-1.9-.9l.5-.4a12.3 12.3 0 0 0 10.6 0l.5.4c-.6.3-1.3.6-1.9.9l.9 1.4a17 17 0 0 0 5.2-2.6c.4-4.5-.8-8.4-3.7-11.8ZM9.7 15c-1 0-1.8-.9-1.8-2s.8-2 1.8-2 1.8.9 1.8 2-.8 2-1.8 2Zm4.6 0c-1 0-1.8-.9-1.8-2s.8-2 1.8-2 1.8.9 1.8 2-.8 2-1.8 2Z" />
              </svg>
            </a>
          </div>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-black text-white">دسترسی سریع</h3>
          <ul className="space-y-2.5">
            {QUICK_LINKS.map((l) => (
              <li key={l.label}>
                <Link
                  href={l.href}
                  className="text-sm text-slate-400 transition-colors hover:text-neon-cyan"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-black text-white">پرفروش‌ترین‌ها</h3>
          <ul className="space-y-2.5">
            {GAMES.map((g) => (
              <li key={g.label}>
                <Link
                  href={g.href}
                  className="text-sm text-slate-400 transition-colors hover:text-neon-cyan"
                >
                  {g.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-white/5 py-5">
        <p className="container-x text-center text-xs text-slate-500">
          © ۱۴۰۴ گیمزل — تمامی حقوق محفوظ است.
        </p>
      </div>
    </footer>
  );
}
