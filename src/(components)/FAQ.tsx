// app/(components)/FAQ.tsx
"use client"; // client expand/collapse

import { useState } from "react";

const faqs = [
  {
    q: "How can I find the best last‑minute flight deals?",
    a: "Use flexible dates and the 'Everywhere' destination to discover cheaper routes. Set Price Alerts to get notified when fares drop, and try nearby airports to unlock additional savings.",
  },
  {
    q: "How can I stay updated on flight deals and low fares?",
    a: "Subscribe to Price Alerts, enable push notifications, and follow our weekly deal roundups. You can also save your searches to receive personalized offer updates.",
  },
  {
    q: "What happens after I've booked my flight?",
    a: "You'll receive an instant email confirmation with your booking reference. From there, you can manage seats, add bags, and check in when the airline opens online check‑in.",
  },
  {
    q: "Where should I book a flight to right now?",
    a: "Check trending destinations on the homepage, filter by weather or budget, and explore 'Everywhere' results to see the cheapest countries and cities from your location.",
  },
  {
    q: "Do flight prices go down closer to the departure date?",
    a: "Not always. Prices can fluctuate based on demand. Booking 4–8 weeks in advance is often optimal for short‑haul, while long‑haul can benefit from booking earlier. Use Price Alerts to catch dips.",
  },
  {
    q: "Is it cheaper to fly with a stopover?",
    a: "Often, yes. Adding a stop can reduce fares significantly on long routes. Use the 'Stops' filter to compare non‑stop vs 1‑stop options and weigh savings against total travel time.",
  },
  {
    q: "What's the best day to book flights?",
    a: "There's no universal 'cheapest' day, but mid‑week departures can be cheaper in many markets. The best approach is to compare a range of dates and set alerts.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section
      className="max-w-7xl mx-auto py-12 px-6 sm:px-12 lg:px-20"
      style={{
        color: "#161616",
        fontFamily:
          "var(--font-poppins), var(--font-geist-sans), -apple-system, BlinkMacSystemFont, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif",
        fontSize: "1.05rem",
        lineHeight: "1.75rem",
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
            <p className="mt-2 text-gray-700">{faq.a}</p>
          )}
        </div>
      ))}
    </section>
  );
}
