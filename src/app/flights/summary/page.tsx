"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/(components)/ui/card";
import { Button } from "@/(components)/ui/button";
import { bookingService } from "@/lib/api/booking";
import type { Flight } from "@/types/flight";

// Generate a random user ID (this should be replaced with proper auth)
const generateUserId = () => `user_${Math.random().toString(36).substr(2, 9)}`;

export default function BookingSummaryPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [flight, setFlight] = useState<Flight | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get the flight details from URL params
  const flightData = searchParams?.get("flightData");
  const travellers = searchParams?.get("travellers") || "1";

  useEffect(() => {
    if (flightData) {
      try {
        const parsedFlight = JSON.parse(decodeURIComponent(flightData)) as Flight;
        setFlight(parsedFlight);
      } catch (err) {
        setError("Invalid flight data");
      }
    }
  }, [flightData]);

  const handleBooking = async () => {
    if (!flight) return;

    setLoading(true);
    setError(null);

    try {
      // In a real app, this would come from your auth system
      const userId = generateUserId();

      const response = await bookingService.createBooking({
        userId,
        flightId: flight.id,
        noOfSeats: parseInt(travellers, 10),
      });

      if (response.success) {
        // Redirect to booking confirmation page
        router.push(`/bookings/${response.data.id}`);
      } else {
        setError(response.message || "Failed to create booking");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create booking");
    } finally {
      setLoading(false);
    }
  };

  if (!flight) {
    return (
      <div className="container mx-auto p-8">
        <Card>
          <CardContent className="p-6">
            <div className="text-center text-red-500">
              {error || "No flight details available"}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8">
      <Card>
        <CardHeader>
          <CardTitle>Booking Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Flight Details */}
          <div className="space-y-4">
            <div className="flex justify-between items-start border-b pb-4">
              <div>
                <h3 className="font-semibold">Flight Details</h3>
                <p className="text-sm text-muted-foreground">
                  {flight.flightNumber} - {flight.airline.name}
                </p>
                <p className="text-sm text-muted-foreground">
                  {flight.departure.airport.code} → {flight.arrival.airport.code}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">
                  {flight.departure.time} - {flight.arrival.time}
                </p>
                <p className="text-sm text-muted-foreground">{flight.duration}</p>
              </div>
            </div>

            {/* Passenger Details */}
            <div className="border-b pb-4">
              <h3 className="font-semibold mb-2">Passenger Details</h3>
              <p className="text-sm text-muted-foreground">
                Number of Passengers: {travellers}
              </p>
            </div>

            {/* Price Summary */}
            <div>
              <h3 className="font-semibold mb-2">Price Summary</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Base Fare ({travellers} {parseInt(travellers, 10) > 1 ? 'passengers' : 'passenger'})</span>
                  <span>₹{(flight.price.amount * parseInt(travellers, 10)).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Taxes & Fees</span>
                  <span>Included</span>
                </div>
                <div className="flex justify-between font-semibold pt-2 border-t">
                  <span>Total Amount</span>
                  <span>₹{(flight.price.amount * parseInt(travellers, 10)).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => router.back()}>
            Back
          </Button>
          <Button 
            onClick={handleBooking} 
            disabled={loading}
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            {loading ? "Processing..." : "Confirm Booking"}
          </Button>
        </CardFooter>
      </Card>

      {error && (
        <div className="mt-4 p-4 bg-red-50 text-red-600 rounded">
          {error}
        </div>
      )}
    </div>
  );
}
