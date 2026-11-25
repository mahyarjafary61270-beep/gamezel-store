const GAMES = [
  "دوتا ۲",
  "GTA V",
  "EA FC 27",
  "ولورانت",
  "کانتر استرایک ۲",
  "پابجی موبایل",
  "کال آف دیوتی",
  "راکت لیگ",
  "الدن رینگ",
  "فورتنایت",
];

export default function GameMarquee() {
  const items = [...GAMES, ...GAMES];
  return (
    <div className="relative overflow-hidden border-y border-white/5 bg-night-900/70 py-4">
      <div className="animate-marquee flex w-max items-center gap-10 whitespace-nowrap">
        {items.map((g, i) => (
          <span key={i} className="flex items-center gap-10">
            <span className="text-sm font-bold text-slate-400 transition-colors hover:text-neon-mint">
              {g}
            </span>
            <svg
              viewBox="0 0 24 24"
              className="h-3 w-3 text-emerald-500/70"
              fill="currentColor"
            >
              <path d="M12 0l2.6 9.4L24 12l-9.4 2.6L12 24l-2.6-9.4L0 12l9.4-2.6L12 0z" />
            </svg>
          </span>
        ))}
      </div>
    </div>
  );
}
