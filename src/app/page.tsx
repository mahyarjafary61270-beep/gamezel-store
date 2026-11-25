import Hero from "@/components/home/Hero";
import GameMarquee from "@/components/home/GameMarquee";
import StoreSection from "@/components/home/StoreSection";
import Features from "@/components/home/Features";
import CtaBand from "@/components/home/CtaBand";
import { getStoreData } from "@/lib/store-data";

export const dynamic = "force-dynamic";

export default async function Home() {
  const { listings } = await getStoreData();
  const featured = listings[0] ?? null;
  const minPrice = listings.length
    ? Math.min(...listings.map((l) => l.price))
    : null;

  return (
    <>
      <Hero featured={featured} minPrice={minPrice} />
      <GameMarquee />
      <StoreSection />
      <Features />
      <CtaBand />
    </>
  );
}
