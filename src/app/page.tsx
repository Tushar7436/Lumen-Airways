import Navbar from "@/(components)/Navbar";
import HeroSection from "@/(components)/HeroSection";
import Extra from "@/(components)/Extra";
import FAQ from "@/(components)/FAQ";
import Footer from "@/(components)/Footer";
import Recommendations from "@/(components)/Recommendations";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <HeroSection />
      <Recommendations />
      <FAQ />
      <Extra />
      <Footer />
    </>
  );
}
