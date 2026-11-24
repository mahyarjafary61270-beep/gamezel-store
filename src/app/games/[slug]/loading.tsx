export default function GameLoading() {
  return (
    <div className="container-x animate-pulse pb-24 pt-28">
      <div className="h-4 w-48 rounded bg-white/10" />
      <div className="mt-8 grid gap-10 lg:grid-cols-[360px_1fr]">
        <div className="aspect-square rounded-2xl bg-white/5" />
        <div className="space-y-4">
          <div className="h-7 w-24 rounded-full bg-white/10" />
          <div className="h-10 w-2/3 rounded bg-white/10" />
          <div className="h-4 w-44 rounded bg-white/5" />
          <div className="h-24 rounded-2xl bg-white/5" />
        </div>
      </div>
      <div className="mt-16 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-48 rounded-2xl bg-white/5" />
        ))}
      </div>
    </div>
  );
}
