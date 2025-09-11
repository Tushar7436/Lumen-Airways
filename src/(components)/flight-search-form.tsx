"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/(components)/ui/button";
import { Label } from "@/(components)/ui/label";
import { ArrowLeftRight } from "lucide-react";
import DatePickerModal from "@/(components)/ui/date-picker-modal";
import PassengerModal from "@/(components)/ui/passenger-modal";
import api from "@/lib/axios";

export default function FlightSearchForm() {
  const formatDate = (d: Date) => d.toLocaleDateString("en-GB");
  const router = useRouter();
  const [fromLocation, setFromLocation] = useState("");
  const [toLocation, setToLocation] = useState("");
  const [departDate, setDepartDate] = useState(formatDate(new Date()));
  const [passengers, setPassengers] = useState({ adults: 1, children: 0 });
  const [cabinClass, setCabinClass] = useState("Economy");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showPassengerModal, setShowPassengerModal] = useState(false);

  const [fromOptions, setFromOptions] = useState<string[]>([]);
  const [toOptions, setToOptions] = useState<string[]>([]);
  const [fromQuery, setFromQuery] = useState("");
  const [toQuery, setToQuery] = useState("");
  const [fromOpen, setFromOpen] = useState(false);
  const [toOpen, setToOpen] = useState(false);

  const fromRef = useRef<HTMLDivElement | null>(null);
  const toRef = useRef<HTMLDivElement | null>(null);

  // ✅ Fetch flights & extract from/to options
  useEffect(() => {
    const fetchFlights = async () => {
      try {
        const res = await api.get("/flightService/api/v1/flights");
        const json = res.data;

        if (json.success && Array.isArray(json.data)) {
          const flights = json.data;

          // Collect unique departure & arrival airport codes
          const departures = Array.from(
            new Set(
              flights.map((f: any) => String(f.departureAirportId ?? ""))
            )
          ) as string[];
          const arrivals = Array.from(
            new Set(
              flights.map((f: any) => String(f.arrivalAirportId ?? ""))
            )
          ) as string[];

          setFromOptions(departures);
          setToOptions(arrivals);

          // Set defaults
          const defaultFrom = departures[0] || "";
          const defaultTo = arrivals[0] || "";
          setFromLocation(defaultFrom);
          setToLocation(defaultTo);
          setFromQuery(defaultFrom);
          setToQuery(defaultTo);
        }
      } catch (err) {
        console.error("Error fetching flights:", err);
      }
    };

    fetchFlights();
  }, []);

  const handleSwapLocations = () => {
    const currentFrom = fromLocation;
    const currentTo = toLocation;
    const currentFromQuery = fromQuery;
    const currentToQuery = toQuery;
    setFromLocation(currentTo);
    setToLocation(currentFrom);
    setFromQuery(currentToQuery);
    setToQuery(currentFromQuery);
  };

  const handleDateSelect = (date: string) => {
    setDepartDate(date);
    setShowDatePicker(false);
  };

  const handlePassengerUpdate = (
    adults: number,
    children: number,
    cabin: string
  ) => {
    setPassengers({ adults, children });
    setCabinClass(cabin);
    setShowPassengerModal(false);
  };

  const getPassengerText = () => {
    const total = passengers.adults + passengers.children;
    return total === 1
      ? `1 Adult, ${cabinClass}`
      : `${total} Travellers, ${cabinClass}`;
  };

  const toIsoDate = (dateStr: string) => {
    const [dd, mm, yyyy] = dateStr.split("/");
    return `${yyyy}-${mm}-${dd}`;
  };

  const goToResults = () => {
    if (!fromLocation || !toLocation) return;
    const trips = `${fromLocation}-${toLocation}`;
    const travellers = String(passengers.adults + passengers.children);
    const tripDate = toIsoDate(departDate);
    const params = new URLSearchParams({ trips, travellers, tripDate });
    router.push(`/flights?${params.toString()}`);
  };

  // Close dropdowns on outside click
  useEffect(() => {
    const onDocMouseDown = (e: MouseEvent) => {
      if (fromOpen && fromRef.current && !fromRef.current.contains(e.target as Node)) {
        setFromOpen(false);
      }
      if (toOpen && toRef.current && !toRef.current.contains(e.target as Node)) {
        setToOpen(false);
      }
    };
    document.addEventListener("mousedown", onDocMouseDown);
    return () => document.removeEventListener("mousedown", onDocMouseDown);
  }, [fromOpen, toOpen]);

  return (
    <>
      <div className="rounded-lg bg-[#05203c] text-white p-10">
        <div className="max-w-7xl mx-auto">
          {/* Main Search Form */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 bg-white rounded-lg overflow-visible">
            
            {/* From Field */}
            <div ref={fromRef} className="relative p-4 border-r border-gray-300">
              <Label className="text-sm text-gray-600 mb-1">From</Label>
              <input
                value={fromQuery}
                onChange={(e) => {
                  setFromQuery(e.target.value);
                  setFromLocation(e.target.value);
                  setFromOpen(true);
                }}
                onFocus={() => setFromOpen(true)}
                className="w-full border-0 p-0 text-gray-900 font-medium focus-visible:ring-0 bg-transparent outline-none"
                placeholder="departure"
              />
              {fromOpen && (
                <ul className="absolute left-0 right-0 mt-2 max-h-64 overflow-auto bg-white text-gray-900 rounded-lg shadow-xl z-20 border border-gray-200">
                  {fromOptions
                    .filter((opt) =>
                      opt.toLowerCase().includes(fromQuery.toLowerCase())
                    )
                    .map((opt) => (
                      <li
                        key={opt}
                        className={`px-4 py-2 cursor-pointer hover:bg-blue-50 ${
                          fromLocation === opt ? "bg-blue-100 font-semibold" : ""
                        }`}
                        onMouseDown={(e) => {
                          e.preventDefault();
                          setFromLocation(opt);
                          setFromQuery(opt);
                          setFromOpen(false);
                        }}
                      >
                        {opt}
                      </li>
                    ))}
                  {fromOptions.filter((opt) =>
                    opt.toLowerCase().includes(fromQuery.toLowerCase())
                  ).length === 0 && (
                    <li className="px-4 py-2 text-gray-500">No matches found</li>
                  )}
                </ul>
              )}
            </div>
  
            {/* Swap Button */}
            <div className="flex items-center justify-center p-2 border-r border-gray-300">
              <Button
                variant="outline"
                size="icon"
                onClick={handleSwapLocations}
                className="bg-white border-2 border-gray-300 rounded-full w-10 h-10"
              >
                <ArrowLeftRight className="h-4 w-4" />
              </Button>
            </div>
  
            {/* To Field */}
            <div ref={toRef} className="relative p-4 pl-2 border-r border-gray-300">
              <Label className="text-sm text-gray-600 mb-1">To</Label>
              <input
                value={toQuery}
                onChange={(e) => {
                  setToQuery(e.target.value);
                  setToLocation(e.target.value);
                  setToOpen(true);
                }}
                onFocus={() => setToOpen(true)}
                className="w-full border-0 p-0 text-gray-900 font-medium focus-visible:ring-0 bg-transparent outline-none"
                placeholder="destination"
              />
              {toOpen && (
                <ul className="absolute left-0 right-0 mt-2 max-h-64 overflow-auto bg-white text-gray-900 rounded-lg shadow-xl z-20 border border-gray-300">
                  {toOptions
                    .filter((opt) =>
                      opt.toLowerCase().includes(toQuery.toLowerCase())
                    )
                    .map((opt) => (
                      <li
                        key={opt}
                        className={`px-4 py-2 cursor-pointer hover:bg-blue-50 ${
                          toLocation === opt ? "bg-blue-100 font-semibold" : ""
                        }`}
                        onMouseDown={(e) => {
                          e.preventDefault();
                          setToLocation(opt);
                          setToQuery(opt);
                          setToOpen(false);
                        }}
                      >
                        {opt}
                      </li>
                    ))}
                  {toOptions.filter((opt) =>
                    opt.toLowerCase().includes(toQuery.toLowerCase())
                  ).length === 0 && (
                    <li className="px-4 py-2 text-gray-500">No matches found</li>
                  )}
                </ul>
              )}
            </div>
  
            {/* Depart Date */}
            <div
              className="relative p-4 border-r border-gray-300 cursor-pointer"
              onClick={() => setShowDatePicker(true)}
            >
              <Label className="text-sm text-gray-600 mb-1">Depart</Label>
              <div className="flex items-center gap-2">
                <span className="text-gray-900 font-medium">{departDate}</span>
              </div>
            </div>
  
            {/* Travellers and Cabin Class */}
            <div
              className="relative p-4 cursor-pointer"
              onClick={() => setShowPassengerModal(true)}
            >
              <Label className="text-sm text-left text-gray-600 mb-1">
                Travellers 
              </Label>
              <div className="flex items-center gap-2">
                <span className="text-gray-900 font-medium">
                  {getPassengerText()}
                </span>
              </div>
            </div>
          </div>
  
          {/* Options and Search */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mt-4 gap-4">
            <Button onClick={goToResults} className="bg-white hover:bg-blue-100 text-gray-900 px-8 py-6 text-lg font-medium rounded-lg shadow">
              Search
            </Button>
          </div>
        </div>
      </div>
  
      {/* Modals */}
      <DatePickerModal
        isOpen={showDatePicker}
        onClose={() => setShowDatePicker(false)}
        onDateSelect={handleDateSelect}
        selectedDate={departDate}
        tripType="one-way"
      />
  
      <PassengerModal
        isOpen={showPassengerModal}
        onClose={() => setShowPassengerModal(false)}
        onUpdate={handlePassengerUpdate}
        adults={passengers.adults}
        children={passengers.children}
        cabinClass={cabinClass}
      />
    </>
  );
  
}
