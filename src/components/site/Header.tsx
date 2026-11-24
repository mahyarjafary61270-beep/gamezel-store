"use client";

import { useState } from "react";
import Link from "next/link";
import { logoutAction } from "@/lib/auth-actions";

const NAV = [
  { href: "/#games", label: "بازی‌ها" },
  { href: "/#features", label: "چرا گیمزل؟" },
  { href: "/#about", label: "درباره ما" },
  { href: "/#faq", label: "سوالات متداول" },
];

type HeaderUser = { name: string; role: string } | null;

export default function Header({ user }: { user: HeaderUser }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/5 bg-night-950/70 backdrop-blur-xl">
      <div className="container-x flex h-16 items-center justify-between gap-4">
        <Link href="/" className="group flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-violet-600 to-cyan-500 shadow-[0_0_18px_rgba(139,92,246,0.55)] transition-transform duration-300 group-hover:rotate-12">
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
          <span className="neon-text text-xl font-black tracking-tight">
            گیمزل
          </span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-slate-300 transition-colors hover:text-neon-cyan"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/#games"
            aria-label="سبد خرید"
            className="glass relative grid h-10 w-10 place-items-center rounded-xl text-slate-200 transition-colors hover:text-neon-cyan"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="9" cy="21" r="1.5" />
              <circle cx="19" cy="21" r="1.5" />
              <path d="M2.5 3h2l2.6 12.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L22.5 7H6" />
            </svg>
            <span className="absolute -left-1.5 -top-1.5 grid h-5 min-w-5 place-items-center rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 px-1 text-[11px] font-bold text-white shadow-[0_0_10px_rgba(139,92,246,0.7)]">
              ۰
            </span>
          </Link>
          {user ? (
            <div className="flex items-center gap-2">
              {user.role === "admin" && (
                <Link href="/admin" className="ghost-btn !px-4 !py-2 text-sm">
                  پنل مدیریت
                </Link>
              )}
              <span className="hidden max-w-28 truncate text-sm font-medium text-slate-300 lg:block">
                {user.name}
              </span>
              <form action={logoutAction}>
                <button type="submit" className="ghost-btn !px-4 !py-2 text-sm">
                  خروج
                </button>
              </form>
            </div>
          ) : (
            <Link href="/login" className="glow-btn !px-4 !py-2 text-sm">
              ورود
            </Link>
          )}
          <button
            onClick={() => setOpen(!open)}
            aria-label="منو"
            className="glass grid h-10 w-10 place-items-center rounded-xl text-slate-200 md:hidden"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              {open ? (
                <path d="M6 6l12 12M18 6L6 18" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h10" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-white/5 bg-night-950/95 px-6 py-4 backdrop-blur-xl md:hidden">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="block rounded-lg px-3 py-2.5 text-sm font-medium text-slate-300 transition-colors hover:bg-white/5 hover:text-neon-cyan"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
