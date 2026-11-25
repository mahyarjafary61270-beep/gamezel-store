import Link from "next/link";

const TABS = [
  { href: "/panel", label: "داشبورد", exact: true },
  { href: "/panel/orders", label: "سفارش‌های من", exact: false },
];

export default function PanelNav({ active }: { active: string }) {
  return (
    <nav className="mt-8 flex flex-wrap gap-2">
      {TABS.map((t) => {
        const isActive = t.exact ? active === t.href : active.startsWith(t.href);
        return (
          <Link
            key={t.href}
            href={t.href}
            className={`rounded-xl px-5 py-2.5 text-sm font-bold transition-colors ${
              isActive
                ? "bg-gradient-to-l from-emerald-600 to-teal-500 text-white shadow-[0_0_16px_rgba(16,185,129,0.4)]"
                : "glass text-slate-300 hover:text-neon-mint"
            }`}
          >
            {t.label}
          </Link>
        );
      })}
    </nav>
  );
}
