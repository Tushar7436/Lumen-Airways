// app/(components)/FAQ.tsx
"use client"; // client expand/collapse

import { useState } from "react";

const faqs = [
  { q: "How can I find the best last minute flight deals?", a: "Use our filters and set up alerts." },
  { q: "How can I stay updated on flight deals and low fares?", a: "Subscribe to notifications or newsletters." },
  { q: "What happens after I've booked my flight?", a: "You’ll receive an email confirmation instantly." },
  { q: "Where should I book a flight to right now?", a: "Check trending deals on the homepage." },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section
      className="max-w-7xl mx-auto py-12 px-6 sm:px-12 lg:px-20"
      style={{
        color: "#161616",
        fontFamily:
          "Skyscanner Relative, -apple-system, BlinkMacSystemFont, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif",
        fontSize: "1.2rem",
        lineHeight: "1.3rem",

      }}
    >
      <h2 className="text-4xl text-left font-bold mb-6">Finding flight deals: frequently asked questions</h2>
      {faqs.map((faq, idx) => (
        <div key={idx} className="border-b py-4">
          <button
            onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
            className="flex justify-between w-full text-left font-semibold"
          >
            {faq.q}
            <span>{openIndex === idx ? "−" : "+"}</span>
          </button>
          {openIndex === idx && (
            <p className="mt-2 text-gray-600">{faq.a}</p>
          )}
        </div>
      ))}
    </section>
  );
}
