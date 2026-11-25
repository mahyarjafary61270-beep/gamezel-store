import Reveal from "@/components/anim/Reveal";

const FEATURES = [
  {
    title: "تحویل فوری",
    desc: "بعد از تایید پرداخت، اکانت بلافاصله توی پنل کاربری‌ات آزاد می‌شه.",
    icon: (
      <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8z" />
    ),
  },
  {
    title: "اکانت اورجینال",
    desc: "همه اکانت‌ها اورجینال و با اطلاعات کامل تحویل داده می‌شن؛ بدون ریسک بن.",
    icon: (
      <>
        <path d="M12 2l8 4v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6l8-4z" />
        <path d="M9 12l2 2 4-4" />
      </>
    ),
  },
  {
    title: "پشتیبانی ۲۴/۷",
    desc: "قبل و بعد از خرید کنارتیم؛ تلگرام و تیکت، هر ساعت شبانه‌روز.",
    icon: (
      <>
        <path d="M4 13a8 8 0 0 1 16 0" />
        <rect x="2" y="13" width="4" height="7" rx="2" />
        <rect x="18" y="13" width="4" height="7" rx="2" />
        <path d="M20 20a4 4 0 0 1-4 2h-3" />
      </>
    ),
  },
  {
    title: "پرداخت امن",
    desc: "کارت به کارت با بررسی دقیق رسید توسط ادمین — بدون هیچ واسطه‌ای.",
    icon: (
      <>
        <rect x="2" y="6" width="20" height="13" rx="3" />
        <path d="M2 11h20" />
        <path d="M6 16h4" />
      </>
    ),
  },
];

export default function Features() {
  return (
    <section id="features" className="relative py-24">
      <div className="absolute right-[-10%] top-1/3 h-80 w-80 rounded-full bg-emerald-500/10 blur-[120px]" />
      <div className="container-x relative">
        <Reveal className="text-center">
          <span className="glass inline-block rounded-full px-4 py-1.5 text-xs font-bold text-neon-mint">
            مزیت‌ها
          </span>
          <h2 className="mt-4 text-3xl font-black text-white sm:text-4xl">
            چرا <span className="neon-text">گیمزل؟</span>
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f, i) => (
            <Reveal key={f.title} delay={i * 0.12}>
              <div className="card-glow glass h-full rounded-2xl p-6">
                <span className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-emerald-600/30 to-lime-500/30 text-neon-mint shadow-[0_0_20px_rgba(16,185,129,0.25)]">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    {f.icon}
                  </svg>
                </span>
                <h3 className="mt-5 text-base font-black text-white">
                  {f.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-slate-400">{f.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
