"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/(components)/ui/card";
import { Button } from "@/(components)/ui/button";
import { RadioGroup, RadioGroupItem } from "@/(components)/ui/radio-group";
import { Label } from "@/(components)/ui/label";
import type { BookingResponse } from "@/lib/api/booking";

interface PaymentMethod {
  id: string;
  name: string;
  description: string;
  icon?: string;
}

const PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: "upi",
    name: "UPI",
    description: "Pay using any UPI app",
  },
  {
    id: "card",
    name: "Credit/Debit Card",
    description: "Pay using credit or debit card",
  },
  {
    id: "netbanking",
    name: "Net Banking",
    description: "Pay using net banking",
  },
];

export default function PaymentOptionsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedMethod, setSelectedMethod] = useState<string>("upi");
  const [booking, setBooking] = useState<BookingResponse["data"] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const bookingData = searchParams?.get("bookingData");
    if (bookingData) {
      try {
        const parsedBooking = JSON.parse(decodeURIComponent(bookingData)) as BookingResponse["data"];
        setBooking(parsedBooking);
      } catch (err) {
        setError("Invalid booking data");
      }
    }
  }, [searchParams]);

  const handlePayment = () => {
    // Here you would integrate with your payment provider
    // For now, we'll just simulate a redirect
    router.push(`/payment/process?method=${selectedMethod}&bookingId=${booking?.id}`);
  };

  if (!booking) {
    return (
      <div className="container mx-auto p-8">
        <Card>
          <CardContent className="p-6">
            <div className="text-center text-red-500">
              {error || "No booking information available"}
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
          <CardTitle>Select Payment Method</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Booking Summary */}
          <div className="bg-muted p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Booking Summary</h3>
            <div className="space-y-1 text-sm">
              <p>Booking ID: {booking.id}</p>
              <p>Number of Seats: {booking.noOfSeats}</p>
              <p className="font-semibold">Total Amount: ₹{booking.totalAmount.toLocaleString()}</p>
            </div>
          </div>

          {/* Payment Methods */}
          <div>
            <h3 className="font-semibold mb-4">Payment Methods</h3>
            <RadioGroup value={selectedMethod} onValueChange={setSelectedMethod}>
              <div className="space-y-4">
                {PAYMENT_METHODS.map((method) => (
                  <div key={method.id} className="flex items-center space-x-3">
                    <RadioGroupItem value={method.id} id={method.id} />
                    <Label htmlFor={method.id} className="flex flex-col">
                      <span className="font-medium">{method.name}</span>
                      <span className="text-sm text-muted-foreground">
                        {method.description}
                      </span>
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => router.back()}>
            Back
          </Button>
          <Button 
            onClick={handlePayment}
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            Pay ₹{booking.totalAmount.toLocaleString()}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
