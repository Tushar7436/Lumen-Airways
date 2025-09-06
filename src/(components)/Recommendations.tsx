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
  
  const deals: Deal[] = [
    {
      city: "Goa",
      country: "India",
      img: "https://picsum.photos/seed/goa/400/200",
      flights: [
        { date: "Sun, 21 Sep", route: "BOM → GOX", airline: "Air India" },
        { date: "Sun, 28 Sep", route: "GOX → BOM", airline: "Air India" },
      ],
      price: "₹ 4,072",
    },
    {
      city: "Muscat",
      country: "Oman",
      img: "https://picsum.photos/seed/muscat/400/200",
      flights: [
        { date: "Wed, 8 Oct", route: "BOM → MCT", airline: "SalamAir" },
        { date: "Wed, 5 Nov", route: "MCT → BOM", airline: "Air India Express" },
      ],
      price: "₹ 8,533",
    },
    {
      city: "Al-Fujairah",
      country: "UAE",
      img: "https://picsum.photos/seed/fujairah/400/200",
      flights: [
        { date: "Fri, 26 Sep", route: "BOM → FJR", airline: "IndiGo" },
        { date: "Tue, 30 Sep", route: "FJR → BOM", airline: "IndiGo" },
      ],
      price: "₹ 13,703",
    },
    {
      city: "Goa",
      country: "India",
      img: "https://picsum.photos/seed/goa/400/200",
      flights: [
        { date: "Sun, 21 Sep", route: "BOM → GOX", airline: "Air India" },
        { date: "Sun, 28 Sep", route: "GOX → BOM", airline: "Air India" },
      ],
      price: "₹ 4,072",
    },
    {
      city: "Muscat",
      country: "Oman",
      img: "https://picsum.photos/seed/muscat/400/200",
      flights: [
        { date: "Wed, 8 Oct", route: "BOM → MCT", airline: "SalamAir" },
        { date: "Wed, 5 Nov", route: "MCT → BOM", airline: "Air India Express" },
      ],
      price: "₹ 8,533",
    },
    {
      city: "Al-Fujairah",
      country: "UAE",
      img: "https://picsum.photos/seed/fujairah/400/200",
      flights: [
        { date: "Fri, 26 Sep", route: "BOM → FJR", airline: "IndiGo" },
        { date: "Tue, 30 Sep", route: "FJR → BOM", airline: "IndiGo" },
      ],
      price: "₹ 13,703",
    },
  ];
  
  export default function Recommendations() {
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
  