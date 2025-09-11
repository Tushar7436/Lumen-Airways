"use client";

import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import api from "@/lib/axios";
import type { Flight, FilterOptions } from "@/types/flight";

export function useFlights() {
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

  // Helper function to format time from ISO string
  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit', 
      hour12: false 
    });
  };

  // Helper function to calculate duration
  const calculateDuration = (departure: string, arrival: string) => {
    const dep = new Date(departure);
    const arr = new Date(arrival);
    const diffMs = arr.getTime() - dep.getTime();
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

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
        const url = `/flightService/api/v1/flights`;
        const body = new URLSearchParams(searchParamsObj as Record<string, string>);
        const { data } = await api.get(url + `?${body.toString()}`);
        
        const flightList = Array.isArray(data?.data) ? data.data : [];
        
        // Transform API data to match our Flight interface
        const transformedFlights: Flight[] = flightList.map((f: any) => ({
          id: f.id.toString(),
          flightNumber: f.flightNumber,
          airline: {
            code: f.flightNumber?.split(" ")[0] || "XX",
            name: f.airplane_detail?.modelNumber || "Unknown Airline"
          },
          departure: {
            time: formatTime(f.departureTime),
            airport: {
              code: f.departure_airport?.code || f.departureAirportId,
              name: f.departure_airport?.name || "Unknown",
              city: f.departure_airport?.cityName || ""
            }
          },
          arrival: {
            time: formatTime(f.arrivalTime),
            airport: {
              code: f.arrival_airport?.code || f.arrivalAirportId,
              name: f.arrival_airport?.name || "Unknown",
              city: f.arrival_airport?.cityName || ""
            }
          },
          duration: calculateDuration(f.departureTime, f.arrivalTime),
          stops: 0, // assuming direct flights for now
          stopDetails: [],
          price: {
            amount: f.price,
            currency: "INR"
          },
          deals: [],
          from: f.departure_airport?.code || f.departureAirportId,
          to: f.arrival_airport?.code || f.arrivalAirportId,
          departureAirportId: f.departureAirportId,
          arrivalAirportId: f.arrivalAirportId,
          departureTime: f.departureTime,
          arrivalTime: f.arrivalTime,
          fare: f.price,
          carrier: f.flightNumber?.split(" ")[0] || "XX"
        }));

        setFlights(transformedFlights);
        setFilteredFlights(transformedFlights);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch flights");
      } finally {
        setLoading(false);
      }
    };

    fetchFlights();
  }, [searchParamsObj]);

  return {
    flights: filteredFlights,
    loading,
    error,
    filters,
    setFilters,
    searchParams: searchParamsObj,
  };
}