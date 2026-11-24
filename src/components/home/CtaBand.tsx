import Reveal from "@/components/anim/Reveal";

export default function CtaBand() {
  return (
    <section id="about" className="relative py-24">
      <div className="container-x">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border border-violet-500/20 bg-gradient-to-l from-violet-950/80 via-night-800 to-cyan-950/60 px-8 py-14 text-center">
            <div className="animate-pulse-glow absolute -top-20 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-violet-600/30 blur-[100px]" />
            <div className="relative">
              <h2 className="text-2xl font-black text-white sm:text-3xl">
                اکانت مورد نظرت رو <span className="neon-text">پیدا نکردی؟</span>
              </h2>
              <p className="mx-auto mt-4 max-w-md text-slate-400">
                هر بازی‌ای بخوای برات پیدا می‌کنیم — فقط کافیه به تلگرام ما پیام
                بدی.
              </p>
              <a
                href="#"
                className="glow-btn mt-8 inline-flex"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-5 w-5"
                  fill="currentColor"
                >
                  <path d="M21.9 4.6 18.9 19c-.2 1-.8 1.2-1.7.8l-4.6-3.4-2.2 2.1c-.3.3-.5.5-.9.5l.3-4.7L18.3 6c.4-.3-.1-.5-.6-.2L7.3 13.4l-4.5-1.4c-1-.3-1-1 .2-1.4L20.6 3.2c.8-.3 1.5.2 1.3 1.4Z" />
                </svg>
                ارتباط با پشتیبانی
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
