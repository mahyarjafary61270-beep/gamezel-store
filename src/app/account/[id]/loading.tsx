export default function AccountLoading() {
  return (
    <div className="container-x animate-pulse pb-24 pt-28">
      <div className="h-4 w-64 rounded bg-white/10" />
      <div className="mt-8 grid gap-10 lg:grid-cols-[420px_1fr]">
        <div className="aspect-square rounded-2xl bg-white/5" />
        <div className="space-y-4">
          <div className="h-7 w-24 rounded-full bg-white/10" />
          <div className="h-10 w-2/3 rounded bg-white/10" />
          <div className="h-24 rounded-2xl bg-white/5" />
          <div className="h-40 rounded-2xl bg-white/5" />
        </div>
      </div>
    </div>
  );
}
