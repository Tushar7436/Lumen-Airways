import api from "@/lib/axios";
import Link from "next/link";

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
  // details used for booking flow
  flightId: string;
  flightNumber: string;
  departureTime: string; // ISO string
  arrivalTime: string; // ISO string
  departureCode: string;
  arrivalCode: string;
  priceValue: number;
  departureCity?: string;
  arrivalCity?: string;
};

async function getDeals(): Promise<Deal[]> {
  try {
    const res = await api.get("/flightService/api/v1/flights");
    const json = res.data;

    if (json.success && Array.isArray(json.data)) {
      const flights = json.data;

      return flights.map((flight: any) => {
        const departureCode = flight.departure_airport?.code || "";
        const arrivalCode = flight.arrival_airport?.code || "";
        const departureTime = flight.departureTime ? new Date(flight.departureTime).toISOString() : "";
        const arrivalTime = flight.arrivalTime ? new Date(flight.arrivalTime).toISOString() : "";
        const priceValue = Number(flight.price) || 0;

        return {
          city: flight.arrival_airport?.City?.name || flight.arrival_airport?.name || "Unknown City",
          country: "India",
          img: `https://picsum.photos/seed/${arrivalCode}/400/200`,
          flights: [
            {
              date: new Date(flight.departureTime).toDateString(),
              route: `${departureCode} → ${arrivalCode}`,
              airline: flight.flightNumber,
            },
          ],
          price: `₹ ${priceValue}`,
          flightId: String(flight.id ?? ""),
          flightNumber: String(flight.flightNumber ?? ""),
          departureTime,
          arrivalTime,
          departureCode,
          arrivalCode,
          priceValue,
          departureCity: flight.departure_airport?.City?.name || flight.departure_airport?.name || departureCode,
          arrivalCity: flight.arrival_airport?.City?.name || flight.arrival_airport?.name || arrivalCode,
        } as Deal;
      });
    }
    return [];
  } catch (error) {
    console.error("Error fetching deals:", error);
    return [];
  }
}

export const revalidate = 900; 

async function RecommendationsContent() {
  const deals = await getDeals();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-left">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Flight Deals from India
            </h1>
            <p className="text-gray-600 max-w-2xl text-base sm:text-lg">
              Here are the flight deals with the lowest prices. Act fast — they all
              depart within the next three months.
            </p>
          </div>
        </div>
      </div>
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {deals.length === 0 ? (
          <div className=" py-16">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-200 flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No deals available</h3>
            <p className="text-gray-600">Check back later for flight deals.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {deals.slice(0, 3).map((deal, idx) => (
              <div
                key={idx}
                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200"
              >
                {/* Image */}
                <div className="relative">
                  <img
                    src={deal.img}
                    alt={deal.city}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-3 right-3 bg-white px-3 py-1 rounded-md shadow-sm">
                    <span className="text-sm font-semibold text-gray-900">
                      {deal.price}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 sm:p-6">
                  {/* Destination */}
                  <div className="mb-4">
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-1">
                      {deal.arrivalCity} ({deal.arrivalCode})
                    </h3>
                    <p className="text-sm text-gray-600">From {deal.departureCity} ({deal.departureCode})</p>
                  </div>

                  {/* Flight Details */}
                  <div className="space-y-3 mb-6">
                    {deal.flights.map((flight, i) => (
                      <div key={i} className="border border-gray-100 rounded-md p-3">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                          <div className="text-sm text-gray-600">
                            {flight.date}
                          </div>
                          <div className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full w-fit">
                            {flight.airline}
                          </div>
                        </div>
                        <div className="mt-2 text-sm font-medium text-gray-900">
                          {flight.route}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Book Button */}
                  <Link
                    href={{
                      pathname: "/flights/summary",
                      query: {
                        flightId: deal.flightId,
                        flightNumber: deal.flightNumber,
                        departureTime: deal.departureTime,
                        arrivalTime: deal.arrivalTime,
                        departureCode: deal.departureCode,
                        arrivalCode: deal.arrivalCode,
                        price: String(deal.priceValue),
                        travellers: "1",
                      },
                    }}
                    className="block w-full bg-gray-900 text-white py-3 px-4 rounded-md font-medium text-center hover:bg-gray-800 transition-colors duration-200"
                  >
                    Book Now
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function Recommendations() {
  return <RecommendationsContent />;
}