"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation"; // ✅ added
import { Button } from "@/(components)/ui/button";
import { Label } from "@/(components)/ui/label";
import { ArrowLeftRight } from "lucide-react";
import DatePickerModal from "@/(components)/ui/date-picker-modal";
import PassengerModal from "@/(components)/ui/passenger-modal";
import AirportDropdown from "@/(components)/ui/airport-dropdown";
import api from "@/lib/axios";

export default function FlightSearchForm() {
  const formatDate = (d: Date) => d.toLocaleDateString("en-GB");
  const router = useRouter();
  const params = useSearchParams(); // ✅ read query params

  // ✅ initialize from query params
  const tripsParam = params.get("trips");
  const initialFrom = tripsParam ? tripsParam.split("-")[0] : "";
  const initialTo = tripsParam ? tripsParam.split("-")[1] : "";
  const initialTravellers = params.get("travellers");
  const initialDate = params.get("tripDate")
    ? new Date(params.get("tripDate")!).toLocaleDateString("en-GB")
    : formatDate(new Date());

  const [fromLocation, setFromLocation] = useState(initialFrom);
  const [toLocation, setToLocation] = useState(initialTo);
  const [departDate, setDepartDate] = useState(initialDate);
  const [passengers, setPassengers] = useState({
    adults: initialTravellers ? parseInt(initialTravellers) : 1,
    children: 0,
  });
  const [cabinClass, setCabinClass] = useState("Economy");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showPassengerModal, setShowPassengerModal] = useState(false);

  const [fromOptions, setFromOptions] = useState<string[]>([]);
  const [toOptions, setToOptions] = useState<string[]>([]);
  const [fromQuery, setFromQuery] = useState(initialFrom);
  const [toQuery, setToQuery] = useState(initialTo);
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
            new Set(flights.map((f: any) => String(f.departureAirportId ?? "")))
          ) as string[];
          const arrivals = Array.from(
            new Set(flights.map((f: any) => String(f.arrivalAirportId ?? "")))
          ) as string[];

          setFromOptions(departures);
          setToOptions(arrivals);

          // ✅ only set defaults if query params didn’t provide anything
          if (!initialFrom && departures.length > 0) {
            setFromLocation(departures[0]);
            setFromQuery(departures[0]);
          }
          if (!initialTo && arrivals.length > 0) {
            setToLocation(arrivals[0]);
            setToQuery(arrivals[0]);
          }
        }
      } catch (err) {
        console.error("Error fetching flights:", err);
      }
    };

    fetchFlights();
  }, []); // run once

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
      <div className="rounded-lg bg-[#05203c] text-white p-15">
        <div className="max-w-10xl mx-auto">
          {/* Main Search Form */}
          <div className="grid grid-cols-1 md:grid-cols-6 gap-6 bg-white rounded-lg overflow-visible">
            
            {/* From Field */}
            <AirportDropdown
              label="From"
              options={fromOptions}
              value={fromLocation}
              onChange={(val) => setFromLocation(val)}
            />

            <AirportDropdown
              label="To"
              options={toOptions}
              value={toLocation}
              onChange={(val) => setToLocation(val)}
            />
  
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

            {/* Depart Date */}
            <div
              className="relative border-r border-gray-300 p-2 cursor-pointer"
              onClick={() => setShowDatePicker(true)}
            >
              <Label className="text-sm text-gray-600 mb-1">Depart</Label>
              <div className="flex items-center gap-2">
                <span className="text-gray-900 font-medium">{departDate}</span>
              </div>
            </div>
  
            {/* Travellers and Cabin Class */}
            <div
              className="relative border-r border-gray-300 p-2 cursor-pointer"
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
            {/* Options and Search */}
            <div className="flex items-center md:items-center gap-4 ">
              <Button
                onClick={goToResults}
                className="bg-blue-100 hover:bg-blue-100 text-gray-900 px-8 py-6 text-lg font-medium rounded-lg shadow cursor-pointer"
              >
                Search
              </Button>
            </div>
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
