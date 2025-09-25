"use client";

import FlightSearchForm from "@/(components)/flight-search-form";
import Image from "next/image";


export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center text-left text-white">
      <div className="absolute inset-0 -z-10">
        <Image
          src="/hero.jpg"
          alt="Hero Image"
          fill
          priority
          sizes="50vw"
          placeholder="blur"
          blurDataURL="/image.png"
          style={{ objectFit: 'cover' }}
        />
      </div>
      {/* Content (text and form) */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <h1 className="text-5xl md:text-6xl font-bold mb-6">
          The best flight offers from anywhere, to everywhere
        </h1>
        <div className="flex gap-8 flex-1 justify-center leading-6 text-center">
        <FlightSearchForm />
        </div>
      </div>
    </section>
  );
}
