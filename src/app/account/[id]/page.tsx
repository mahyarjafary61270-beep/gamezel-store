import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { and, asc, count, eq, isNull } from "drizzle-orm";
import AddToCart from "@/components/cart/AddToCart";
import { getDb } from "@/db";
import { credentials, games, images, listings } from "@/db/schema";
import { formatPrice } from "@/lib/format";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const db = await getDb();
  const listing = await db.query.listings.findFirst({ where: eq(listings.id, id) });
  if (!listing || !listing.isActive) return {};
  return {
    title: listing.title,
    description: listing.description || undefined,
    openGraph: {
      title: `${listing.title} | گیمزل`,
      description: listing.description || undefined,
      locale: "fa_IR",
      type: "website",
    },
  };
}

export default async function AccountPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const db = await getDb();

  const listing = await db.query.listings.findFirst({ where: eq(listings.id, id) });
  if (!listing || !listing.isActive) notFound();

  const game = await db.query.games.findFirst({ where: eq(games.id, listing.gameId) });
  if (!game) notFound();

  const listingImages = await db
    .select({ id: images.id, alt: images.alt })
    .from(images)
    .where(and(eq(images.ownerType, "listing"), eq(images.ownerId, listing.id)))
    .orderBy(asc(images.sortOrder));

  const stockRows = await db
    .select({ count: count() })
    .from(credentials)
    .where(and(eq(credentials.listingId, listing.id), isNull(credentials.orderItemId)));
  const stock = stockRows[0]?.count ?? 0;

  const specs = Object.entries(listing.specs ?? {});

  return (
    <div className="container-x pb-24 pt-28">
      <nav className="text-xs text-slate-400">
        <Link href="/" className="transition-colors hover:text-neon-cyan">
          خانه
        </Link>
        <span className="mx-2">/</span>
        <Link href={`/games/${game.slug}`} className="transition-colors hover:text-neon-cyan">
          {game.title}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-slate-200">{listing.title}</span>
      </nav>

      <div className="mt-8 grid gap-10 lg:grid-cols-[420px_1fr]">
        <div className="card-glow glass overflow-hidden rounded-2xl">
          {listingImages[0] ? (
            <img
              src={`/api/images/${listingImages[0].id}`}
              alt={listingImages[0].alt || listing.title}
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
          <span className="glass inline-block rounded-full px-4 py-1.5 text-xs font-bold text-neon-cyan">
            {game.title}
          </span>
          <h1 className="mt-4 text-3xl font-black text-white sm:text-4xl">{listing.title}</h1>
          {listing.description && (
            <p className="mt-5 leading-8 text-slate-300">{listing.description}</p>
          )}

          {specs.length > 0 && (
            <div className="glass mt-6 overflow-hidden rounded-2xl">
              <h2 className="border-b border-white/5 px-5 py-3 text-sm font-black text-white">
                مشخصات اکانت
              </h2>
              <dl className="divide-y divide-white/5">
                {specs.map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between gap-4 px-5 py-3 text-sm">
                    <dt className="text-slate-400">{key}</dt>
                    <dd className="font-bold text-slate-200">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}

          <div className="glass mt-8 rounded-2xl p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs text-slate-400">قیمت</p>
                <p className="mt-1 text-2xl font-black text-neon-cyan">
                  {formatPrice(listing.price)}
                </p>
              </div>
              <div className="text-left">
                <p className="text-xs text-slate-400">موجودی</p>
                <p className="mt-1 font-black text-white">
                  {stock > 0 ? `${stock.toLocaleString("fa-IR")} عدد` : "ناموجود"}
                </p>
              </div>
            </div>

            <div className="mt-6 border-t border-white/5 pt-6">
              <AddToCart
                listingId={listing.id}
                title={listing.title}
                price={listing.price}
                stock={stock}
              />
              <p className="mt-4 text-xs leading-6 text-slate-500">
                پرداخت کارت به کارت — بعد از تایید رسید توسط ادمین، اکانت بلافاصله در
                پنل کاربری شما قرار می‌گیرد.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
