import Hero from "@/components/home/Hero";
import GameMarquee from "@/components/home/GameMarquee";
import FeaturedGames from "@/components/home/FeaturedGames";
import Features from "@/components/home/Features";
import CtaBand from "@/components/home/CtaBand";

export default function Home() {
  return (
    <>
      <Hero />
      <GameMarquee />
      <FeaturedGames />
      <Features />
      <CtaBand />
    </>
  );
}
