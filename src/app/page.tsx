import HeroSection from "@/(components)/HeroSection";
import Extra from "@/(components)/Extra";
import FAQ from "@/(components)/FAQ";
import Recommendations from "@/(components)/Recommendations";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <Recommendations />
      <FAQ />
      <Extra />
    </>
  );
}
