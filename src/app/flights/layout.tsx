"use client";

import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import type { Metadata } from "next";
import FlightSearchForm from "@/(components)/flight-search-form";
import { FiltersSidebar } from "@/(components)/filters-sidebar";
import { FlightCard } from "@/(components)/flight-card";
import api from "@/lib/axios";
import type { Flight, FilterOptions } from "@/types/flight";

export default function FlightsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const searchParams = useSearchParams();
  const [flights, setFlights] = useState<Flight[]>([]);
  const [filteredFlights, setFilteredFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Filter state
  const [filters, setFilters] = useState<FilterOptions>({
    stops: ["direct", "1stop", "2+stops"],
    departureTime: [0, 24],
    airlines: ["AI", "6E", "SG", "UK"],
    baggage: ["cabin", "checked"],
  });

  // Get search parameters
  const searchParamsObj = useMemo(() => {
    const trips = searchParams?.get("trips") || "";
    const travellers = searchParams?.get("travellers") || "";
    const tripDate = searchParams?.get("tripDate") || "";
    return { trips, travellers, tripDate };
  }, [searchParams]);

  // Fetch flights when search parameters change
  useEffect(() => {
    const fetchFlights = async () => {
      if (!searchParamsObj.trips || !searchParamsObj.travellers || !searchParamsObj.tripDate) {
        setFlights([]);
        setFilteredFlights([]);
        return;
      }

      setLoading(true);
      setError(null);
      
      try {
        const url = `/flights`;
        const body = new URLSearchParams(searchParamsObj as Record<string, string>);
        const { data } = await api.get(url + `?${body.toString()}`);
        
        const flightList = Array.isArray(data?.data) ? data.data : [];
        
        // Transform API data to match our Flight interface
        const transformedFlights: Flight[] = flightList.map((f: any, index: number) => ({
          id: f.id || `flight-${index}`,
          airline: {
            code: f.carrier || f.airline || "AI",
            name: f.airlineName || "Air India"
          },
          departure: {
            time: f.departTime || f.departureTime || "10:00",
            airport: {
              code: f.from || f.departureAirportId || "DEL",
              name: f.departureAirportName,
              city: f.departureCity
            }
          },
          arrival: {
            time: f.arrivalTime || "12:00",
            airport: {
              code: f.to || f.arrivalAirportId || "BOM",
              name: f.arrivalAirportName,
              city: f.arrivalCity
            }
          },
          duration: f.duration || "2h 30m",
          stops: f.stops || 0,
          stopDetails: f.stopDetails,
          price: {
            amount: f.price || f.fare || 0,
            currency: "INR"
          },
          deals: f.deals || [],
          // Keep original fields for compatibility
          from: f.from,
          to: f.to,
          departureAirportId: f.departureAirportId,
          arrivalAirportId: f.arrivalAirportId,
          departTime: f.departTime,
          departureTime: f.departureTime,
          arrivalTime: f.arrivalTime,
          fare: f.fare,
          carrier: f.carrier
        }));

        setFlights(transformedFlights);
        setFilteredFlights(transformedFlights);
      } catch (e: any) {
        setError(e?.message || "Failed to fetch flights");
        setFlights([]);
        setFilteredFlights([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFlights();
  }, [searchParamsObj]);

  // Apply filters when filters change
  useEffect(() => {
    let filtered = [...flights];

    // Filter by stops
    if (filters.stops.length > 0) {
      filtered = filtered.filter(flight => {
        if (filters.stops.includes("direct") && flight.stops === 0) return true;
        if (filters.stops.includes("1stop") && flight.stops === 1) return true;
        if (filters.stops.includes("2+stops") && flight.stops >= 2) return true;
        return false;
      });
    }

    // Filter by departure time
    filtered = filtered.filter(flight => {
      const departureHour = parseInt(flight.departure.time.split(':')[0]);
      return departureHour >= filters.departureTime[0] && departureHour <= filters.departureTime[1];
    });

    // Filter by airlines
    if (filters.airlines.length > 0) {
      filtered = filtered.filter(flight => 
        filters.airlines.includes(flight.airline.code)
      );
    }

    setFilteredFlights(filtered);
  }, [flights, filters]);

  const handleFiltersChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
  };

  const handleFlightSelect = (flightId: string) => {
    // Handle flight selection - could navigate to booking page
    console.log("Selected flight:", flightId);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search Form */}
      <div className="bg-white shadow-sm">
        <FlightSearchForm />
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {loading && (
          <div className="text-center py-8">
            <div className="text-lg">Loading flights...</div>
          </div>
        )}

        {error && (
          <div className="text-center py-8">
            <div className="text-red-600 text-lg">{error}</div>
          </div>
        )}

        {!loading && !error && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Filters Sidebar */}
            <div className="lg:col-span-1">
              <FiltersSidebar 
                filters={filters} 
                onFiltersChange={handleFiltersChange} 
              />
            </div>

            {/* Flight Results */}
            <div className="lg:col-span-3">
              <div className="mb-4">
                <h2 className="text-xl font-semibold">
                  {filteredFlights.length} flights found
                </h2>
                {searchParamsObj.trips && (
                  <p className="text-gray-600">
                    {searchParamsObj.trips} • {searchParamsObj.tripDate}
                  </p>
                )}
              </div>

              <div className="space-y-4">
                {filteredFlights.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No flights found matching your criteria
                  </div>
                ) : (
                  filteredFlights.map((flight) => (
                    <FlightCard
                      key={flight.id}
                      flight={flight}
                      onSelect={handleFlightSelect}
                    />
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* Render children (if any) */}
        {children}
      </div>
    </div>
  );
}


