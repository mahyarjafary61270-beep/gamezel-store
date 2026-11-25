import Hero from "@/components/home/Hero";
import GameMarquee from "@/components/home/GameMarquee";
import StoreSection from "@/components/home/StoreSection";
import Features from "@/components/home/Features";
import CtaBand from "@/components/home/CtaBand";

export default function Home() {
  return (
    <>
      <Hero />
      <GameMarquee />
      <StoreSection />
      <Features />
      <CtaBand />
    </>
  );
}
