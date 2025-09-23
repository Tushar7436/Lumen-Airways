'use client';
import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/(components)/ui/card";
import { Button } from "@/(components)/ui/button";
import api from "@/lib/axios";

function FlightSummaryContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get flight details from URL params
  const flightId = searchParams?.get("flightId");
  const flightNumber = searchParams?.get("flightNumber") || "";
  const departureTime = searchParams?.get("departureTime") || "";
  const arrivalTime = searchParams?.get("arrivalTime") || "";
  const departureCode = searchParams?.get("departureCode") || "";
  const arrivalCode = searchParams?.get("arrivalCode") || "";
  const price = parseFloat(searchParams?.get("price") || "0"); 
  const noOfSeats = parseInt(searchParams?.get("travellers") || "1", 10); 

  // Handle flight booking
  const handleBookFlight = async () => {
    if (loading) return;

    const jwt = localStorage.getItem("jwt_token");
    if (!jwt) {
      const currentUrl = window.location.href;
      router.push(`/auth/login?returnUrl=${encodeURIComponent(currentUrl)}`);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const userId = localStorage.getItem("user_id");
      const recipientEmail = localStorage.getItem("recipientEmail");

      if (!userId) {
        throw new Error("User ID not found");
      }

      const bookingData = {
        userId: userId,
        flightId,
        noOfSeats,
        recipientEmail
      };

      console.log("Sending booking data:", bookingData);
      const response = await api.post("/bookingService/api/v1/bookings", bookingData);
      console.log("Booking response:", response.data);

      if (response.data?.success && response.data?.data) {
        const bookingDetails = response.data.data;
        const paymentUrl = `/flights/payment?bookingId=${bookingDetails.id}&amount=${bookingDetails.totalCost}&status=${bookingDetails.status}`;
        console.log("Redirecting to payment:", paymentUrl);
        router.push(paymentUrl);
      } else {
        throw new Error(response.data?.message || "Booking failed");
      }
    } catch (error: any) {
      console.error("Booking error:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to book flight. Please try again.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!flightId || !departureTime || !arrivalTime) {
    return (
      <div className="container mx-auto p-8">
        <Card>
          <CardContent className="p-6">
            <div className="text-center text-red-500">No flight details available</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8">
      <Card>
        <CardHeader>
          <CardTitle>Flight Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Flight Details */}
          <div className="space-y-4">
            <div className="flex justify-between items-start border-b pb-4">
              <div>
                <h3 className="font-semibold">Flight Details</h3>
                <p className="text-sm text-muted-foreground">{flightNumber}</p>
                <p className="text-sm text-muted-foreground">
                  {departureCode} → {arrivalCode}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">
                  {departureTime} - {arrivalTime}
                </p>
              </div>
            </div>

            {/* Airport Details */}
            <div className="grid grid-cols-2 gap-4 border-b pb-4">
              <div>
                <h4 className="font-semibold mb-2">Departure</h4>
                <p className="text-sm text-muted-foreground">{departureCode}</p>
                <p className="text-sm text-muted-foreground">{departureTime}</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Arrival</h4>
                <p className="text-sm text-muted-foreground">{arrivalCode}</p>
                <p className="text-sm text-muted-foreground">{arrivalTime}</p>
              </div>
            </div>

            {/* Passenger Details */}
            <div className="border-b pb-4">
              <h3 className="font-semibold mb-2">Passenger Details</h3>
              <p className="text-sm text-muted-foreground">
                Number of Passengers: {noOfSeats}
              </p>
            </div>

            {/* Price Summary */}
            <div>
              <h3 className="font-semibold mb-2">Price Summary</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>
                    Base Fare ({noOfSeats} {noOfSeats > 1 ? "passengers" : "passenger"})
                  </span>
                  <span>₹{(price * noOfSeats).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Taxes & Fees</span>
                  <span>Included</span>
                </div>
                <div className="flex justify-between font-semibold pt-2 border-t">
                  <span>Total Amount</span>
                  <span>₹{(price * noOfSeats).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="flex justify-between w-full">
            <Button variant="outline" onClick={() => router.back()} disabled={loading}>
              Back
            </Button>
            <Button
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
              onClick={handleBookFlight}
              disabled={loading}
            >
              {loading ? "Processing..." : "Continue to Payment"}
            </Button>
          </div>
          {error && (
            <div className="text-sm text-red-500 text-center w-full">{error}</div>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}

export default function FlightSummaryPage() {
  return (
    <Suspense fallback={<div>Loading flight summary...</div>}>
      <FlightSummaryContent />
    </Suspense>
  );
}