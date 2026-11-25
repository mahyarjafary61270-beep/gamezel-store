"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { logoutAction } from "@/lib/auth-actions";

const ITEMS: { href: string; label: string; icon: ReactNode }[] = [
  {
    href: "/admin",
    label: "داشبورد",
    icon: (
      <>
        <rect x="3" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" />
      </>
    ),
  },
  {
    href: "/admin/games",
    label: "بازی‌ها",
    icon: (
      <>
        <path d="M6 11h4M8 9v4" />
        <circle cx="15.5" cy="10.5" r="0.8" fill="currentColor" />
        <circle cx="18" cy="13" r="0.8" fill="currentColor" />
        <path d="M17.32 5H6.68a4 4 0 0 0-3.98 3.6L2 15.5A4 4 0 0 0 6 20h12a4 4 0 0 0 4-4.5l-.7-6.9A4 4 0 0 0 17.32 5Z" />
      </>
    ),
  },
  {
    href: "/admin/categories",
    label: "دسته‌بندی‌ها",
    icon: (
      <>
        <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
        <circle cx="7" cy="7" r="1.5" />
      </>
    ),
  },
  {
    href: "/admin/listings",
    label: "اکانت‌ها",
    icon: (
      <>
        <path d="M12 2 2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5" />
        <path d="M2 12l10 5 10-5" />
      </>
    ),
  },
  {
    href: "/admin/orders",
    label: "سفارش‌ها",
    icon: (
      <>
        <circle cx="9" cy="21" r="1.5" />
        <circle cx="19" cy="21" r="1.5" />
        <path d="M2.5 3h2l2.6 12.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L22.5 7H6" />
      </>
    ),
  },
  {
    href: "/admin/users",
    label: "کاربران",
    icon: (
      <>
        <circle cx="12" cy="7" r="4" />
        <path d="M5.5 21a6.5 6.5 0 0 1 13 0" />
      </>
    ),
  },
  {
    href: "/admin/settings",
    label: "تنظیمات",
    icon: (
      <>
        <path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6" />
      </>
    ),
  },
];

export default function AdminNav({ userName }: { userName: string }) {
  const pathname = usePathname();

  const links = (mobile: boolean) =>
    ITEMS.map((item) => {
      const active = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
      return (
        <Link
          key={item.href}
          href={item.href}
          className={`${mobile ? "shrink-0 whitespace-nowrap" : ""} nav-item ${active ? "nav-item-active" : ""}`}
        >
          <svg
            viewBox="0 0 24 24"
            className="h-4 w-4 shrink-0"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {item.icon}
          </svg>
          <span>{item.label}</span>
        </Link>
      );
    });

  return (
    <nav className="shrink-0 lg:sticky lg:top-24 lg:w-60">
      <div className="hidden lg:block">
        <div className="admin-card !p-3">
          <div className="mb-2 flex items-center gap-2.5 border-b border-white/5 px-2 pb-3">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-emerald-600 to-teal-500 text-base font-black text-white">
              گ
            </span>
            <div className="min-w-0">
              <p className="text-sm font-black">پنل مدیریت</p>
              <p className="truncate text-[11px] text-slate-400">{userName}</p>
            </div>
          </div>
          <ul className="space-y-0.5">{links(false)}</ul>
          <ul className="mt-2 space-y-0.5 border-t border-white/5 pt-2">
            <li>
              <Link href="/" className="nav-item">بازگشت به سایت</Link>
            </li>
            <li>
              <form action={logoutAction}>
                <button type="submit" className="nav-item">خروج از حساب</button>
              </form>
            </li>
          </ul>
        </div>
      </div>
      <div className="admin-card !p-2 lg:hidden">
        <ul className="flex gap-1.5 overflow-x-auto">{links(true)}</ul>
      </div>
    </nav>
  );
}
