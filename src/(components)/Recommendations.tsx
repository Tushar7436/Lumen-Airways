// app/recommendations/page.tsx (using App Router with SSG/ISR)

import axios from "axios";

type Flight = {
  date: string;
  route: string;
  airline: string;
};

type Deal = {
  city: string;
  country: string;
  img: string;
  flights: Flight[];
  price: string;
};

async function getDeals(): Promise<Deal[]> {
  try {
    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/flights`);
    const json = res.data;

    if (json.success && Array.isArray(json.data)) {
      const flights = json.data;

      return flights.map((flight: any) => ({
        city: flight.arrival_airport?.name || "Unknown City",
        country: "India", // fallback or extend from backend if available
        img: `https://picsum.photos/seed/${flight.arrival_airport?.code}/400/200`,
        flights: [
          {
            date: new Date(flight.departureTime).toDateString(),
            route: `${flight.departure_airport?.code} → ${flight.arrival_airport?.code}`,
            airline: flight.flightNumber,
          },
        ],
        price: `₹ ${flight.price}`,
      }));
    }
    return [];
  } catch (error) {
    console.error("Error fetching deals:", error);
    return [];
  }
}

// ✅ Static Generation (rebuild every 30 mins with ISR)
export const revalidate = 1800; // 30 minutes

export default async function RecommendationsPage() {
  const deals = await getDeals();

  return (
    <div className="max-w-6xl mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-4">Flight deals from India</h2>
      <p className="text-gray-600 mb-6">
        Here are the flight deals with the lowest prices. Act fast — they all
        depart within the next three months.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {deals.map((deal, idx) => (
          <div
            key={idx}
            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition"
          >
            <img
              src={deal.img}
              alt={deal.city}
              className="w-full h-40 object-cover"
            />
            <div className="p-4">
              <h3 className="text-lg font-bold">{deal.city}</h3>
              <p className="text-sm text-gray-500">{deal.country}</p>
              <div className="mt-3 space-y-1">
                {deal.flights.map((f, i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span>{f.date}</span>
                    <span>
                      {f.route} – {f.airline}
                    </span>
                  </div>
                ))}
              </div>
              <p className="mt-3 text-blue-600 font-semibold">
                from {deal.price}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
