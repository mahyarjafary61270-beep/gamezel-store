import Reveal from "@/components/anim/Reveal";

const GAMES = [
  {
    name: "دوتا ۲",
    en: "DOTA 2",
    tag: "MOBA",
    price: "از ۴۹۰ هزار تومان",
    grad: "from-rose-500/70 via-violet-700/70 to-night-800",
  },
  {
    name: "جی‌تی‌ای V",
    en: "GTA V",
    tag: "اکشن",
    price: "از ۸۹۰ هزار تومان",
    grad: "from-emerald-500/70 via-cyan-700/70 to-night-800",
  },
  {
    name: "EA FC 27",
    en: "FC 27",
    tag: "فوتبال",
    price: "از ۱٬۲۹۰ هزار تومان",
    grad: "from-amber-500/70 via-pink-700/70 to-night-800",
  },
  {
    name: "ولورانت",
    en: "VALORANT",
    tag: "شوتر",
    price: "از ۶۵۰ هزار تومان",
    grad: "from-sky-500/70 via-indigo-700/70 to-night-800",
  },
];

export default function FeaturedGames() {
  return (
    <section id="games" className="relative py-24">
      <div className="absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-violet-600/10 blur-[110px]" />
      <div className="container-x relative">
        <Reveal className="text-center">
          <span className="glass inline-block rounded-full px-4 py-1.5 text-xs font-bold text-neon-cyan">
            فروشگاه
          </span>
          <h2 className="mt-4 text-3xl font-black text-white sm:text-4xl">
            بازی‌های <span className="neon-text">محبوب</span>
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-slate-400">
            پرفروش‌ترین اکانت‌های این هفته — برای دیدن همه اکانت‌ها روی هر بازی
            کلیک کن.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {GAMES.map((g, i) => (
            <Reveal key={g.en} delay={i * 0.12}>
              <a
                href="#games"
                className={`card-glow glass shine group relative block overflow-hidden rounded-2xl bg-gradient-to-br ${g.grad}`}
              >
                <div className="relative h-44 overflow-hidden">
                  <span
                    dir="ltr"
                    className="absolute -bottom-3 left-3 text-6xl font-black tracking-tighter text-white/10 transition-all duration-500 group-hover:text-white/20"
                  >
                    {g.en}
                  </span>
                  <span className="absolute right-4 top-4 rounded-full border border-white/20 bg-black/30 px-3 py-1 text-[11px] font-bold text-white backdrop-blur-sm">
                    {g.tag}
                  </span>
                </div>
                <div className="relative -mt-8 rounded-2xl border border-white/10 bg-night-900/80 p-5 backdrop-blur-xl">
                  <h3 className="text-lg font-black text-white">{g.name}</h3>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-xs text-slate-400">{g.price}</span>
                    <span className="flex items-center gap-1 text-xs font-bold text-neon-cyan">
                      مشاهده
                      <svg
                        viewBox="0 0 24 24"
                        className="h-3.5 w-3.5 rotate-180 transition-transform duration-300 group-hover:-translate-x-1"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M5 12h14M13 6l6 6-6 6" />
                      </svg>
                    </span>
                  </div>
                </div>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
