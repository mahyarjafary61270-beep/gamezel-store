import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { and, asc, count, eq, inArray, isNull } from "drizzle-orm";
import { getDb } from "@/db";
import { categories, credentials, games, images, listings } from "@/db/schema";
import { formatPrice } from "@/lib/format";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const db = await getDb();
  const game = await db.query.games.findFirst({ where: eq(games.slug, slug) });
  if (!game || !game.isActive) return {};
  const description =
    game.description ||
    `خرید اکانت ${game.title} با تحویل فوری و ضمانت اصالت — گیمزل`;
  return {
    title: game.title,
    description,
    openGraph: {
      title: `${game.title} | گیمزل`,
      description,
      locale: "fa_IR",
      type: "website",
    },
  };
}

export default async function GamePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const db = await getDb();

  const game = await db.query.games.findFirst({ where: eq(games.slug, slug) });
  if (!game || !game.isActive) notFound();

  const category = game.categoryId
    ? await db.query.categories.findFirst({ where: eq(categories.id, game.categoryId) })
    : null;

  const gameImages = await db
    .select({ id: images.id, alt: images.alt })
    .from(images)
    .where(and(eq(images.ownerType, "game"), eq(images.ownerId, game.id)))
    .orderBy(asc(images.sortOrder));

  const gameListings = await db
    .select({
      id: listings.id,
      title: listings.title,
      description: listings.description,
      price: listings.price,
    })
    .from(listings)
    .where(and(eq(listings.gameId, game.id), eq(listings.isActive, true)))
    .orderBy(asc(listings.sortOrder));

  const stockRows =
    gameListings.length > 0
      ? await db
          .select({ listingId: credentials.listingId, count: count() })
          .from(credentials)
          .where(
            and(
              isNull(credentials.orderItemId),
              inArray(
                credentials.listingId,
                gameListings.map((l) => l.id)
              )
            )
          )
          .groupBy(credentials.listingId)
      : [];

  const stockByListing = new Map(stockRows.map((s) => [s.listingId, s.count]));

  return (
    <div className="container-x pb-24 pt-28">
      <nav className="text-xs text-slate-400">
        <Link href="/" className="transition-colors hover:text-neon-cyan">
          خانه
        </Link>
        <span className="mx-2">/</span>
        <span className="text-slate-200">{game.title}</span>
      </nav>

      <div className="mt-8 grid gap-10 lg:grid-cols-[360px_1fr]">
        <div className="card-glow glass overflow-hidden rounded-2xl">
          {gameImages[0] ? (
            <img
              src={`/api/images/${gameImages[0].id}`}
              alt={gameImages[0].alt || game.title}
              className="aspect-square w-full object-cover"
            />
          ) : (
            <div className="grid aspect-square w-full place-items-center bg-gradient-to-br from-violet-600/30 to-cyan-600/20">
              <span dir="ltr" className="text-6xl font-black tracking-tighter text-white/20">
                {game.englishTitle}
              </span>
            </div>
          )}
        </div>

        <div>
          {category && (
            <span className="glass inline-block rounded-full px-4 py-1.5 text-xs font-bold text-neon-cyan">
              {category.name}
            </span>
          )}
          <h1 className="mt-4 text-3xl font-black text-white sm:text-4xl">
            اکانت <span className="neon-text">{game.title}</span>
          </h1>
          <p className="mt-1 text-sm font-medium text-slate-400" dir="ltr">
            {game.englishTitle}
          </p>
          {game.description && (
            <p className="mt-5 leading-8 text-slate-300">{game.description}</p>
          )}
          {game.features.length > 0 && (
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {game.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-slate-200">
                  <svg
                    viewBox="0 0 24 24"
                    className="mt-0.5 h-4 w-4 shrink-0 text-neon-cyan"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                  {f}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <section className="mt-16">
        <h2 className="text-xl font-black text-white sm:text-2xl">
          اکانت‌های آماده <span className="text-slate-500">({gameListings.length.toLocaleString("fa-IR")})</span>
        </h2>

        {gameListings.length === 0 ? (
          <p className="glass mt-6 rounded-2xl p-8 text-center text-slate-400">
            فعلا اکانتی برای این بازی ثبت نشده — به‌زودی موجود می‌شه.
          </p>
        ) : (
          <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {gameListings.map((l) => {
              const stock = stockByListing.get(l.id) ?? 0;
              return (
                <Link
                  key={l.id}
                  href={`/account/${l.id}`}
                  className="card-glow glass group block rounded-2xl p-6 transition-transform duration-300 hover:-translate-y-1"
                >
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-black text-white">{l.title}</h3>
                    {stock > 0 ? (
                      <span className="badge badge-success shrink-0">{stock.toLocaleString("fa-IR")} عدد</span>
                    ) : (
                      <span className="badge badge-danger shrink-0">ناموجود</span>
                    )}
                  </div>
                  {l.description && (
                    <p className="mt-3 line-clamp-2 text-sm leading-7 text-slate-400">
                      {l.description}
                    </p>
                  )}
                  <div className="mt-5 flex items-center justify-between">
                    <span className="text-lg font-black text-neon-cyan">
                      {formatPrice(l.price)}
                    </span>
                    <span className="flex items-center gap-1 text-xs font-bold text-slate-300 transition-colors group-hover:text-neon-cyan">
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
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
