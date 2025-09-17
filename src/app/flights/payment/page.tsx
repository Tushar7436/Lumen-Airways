"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/(components)/ui/card";
import { Button } from "@/(components)/ui/button";
import api from "@/lib/axios";

export default function PaymentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentDetails, setPaymentDetails] = useState<{ bookingId: string; amount: number; status: string } | null>(null);
  const [timer, setTimer] = useState(420); // 7 minutes in seconds
  const [paymentResponse, setPaymentResponse] = useState<any>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);

  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const bookingId = searchParams.get("bookingId");
    const amount = parseFloat(searchParams.get("amount") || "0");
    const status = searchParams.get("status");

    if (bookingId && status) {
      setPaymentDetails({ bookingId, amount, status });
    } else {
      setError("Invalid payment details");
    }
  }, [searchParams]);

  // Timer effect
  useEffect(() => {
    if (paymentConfirmed) return;
    
    intervalRef.current = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!);
          if (!paymentConfirmed) router.push("/");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [router, paymentConfirmed]);

  // Format timer mm:ss
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  // Confirm payment handler
  const handleConfirmPayment = async () => {
    if (!paymentDetails) return;
    
    setLoading(true);
    setError(null);
    setPaymentResponse(null);
    
    try {
      if (!userId) {
        throw new Error('User ID not found');
      }
      const paymentData = {
        totalCost: paymentDetails.amount,
        userId: Number(userId),
        bookingId: Number(paymentDetails.bookingId),
      };
      const jwt = localStorage.getItem('jwt_token');
      const res = await api.post("/bookingService/api/v1/bookings/payments", paymentData, {
        headers: {
          'x-idempotency-key': jwt || ''
        }
      });
      setPaymentResponse(res.data);
      setPaymentConfirmed(true);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Payment failed");
    } finally {
      setLoading(false);
    }
  };

  if (loading && !paymentConfirmed) {
    return (
      <div className="container mx-auto p-8">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">Processing payment...</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !paymentDetails) {
    return (
      <div className="container mx-auto p-8">
        <Card>
          <CardContent className="p-6">
            <div className="text-center text-red-500">
              {error || "Payment details not found"}
            </div>
            <Button 
              className="mt-4" 
              variant="outline" 
              onClick={() => router.push("/")}
            >
              Return to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8">
      <Card>
        <CardHeader>
          <CardTitle>Payment</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center text-lg font-semibold">
            Time left to complete payment: <span className="text-red-600">{formatTime(timer)}</span>
          </div>
          <div className="space-y-2">
            <div>Booking ID: <span className="font-bold">{paymentDetails.bookingId}</span></div>
            <div>Amount: <span className="font-bold">₹{paymentDetails.amount}</span></div>
            <div>Status: <span className="font-bold">{paymentDetails.status}</span></div>
          </div>
          {paymentResponse && (
            <div className="mt-4 p-4 border rounded bg-green-50 text-green-700">
              <div className="font-bold mb-2">Payment Response:</div>
              <pre className="text-xs whitespace-pre-wrap">{JSON.stringify(paymentResponse, null, 2)}</pre>
            </div>
          )}
          {error && (
            <div className="mt-4 p-4 border rounded bg-red-50 text-red-700">
              <div className="font-bold mb-2">Error:</div>
              <pre className="text-xs whitespace-pre-wrap">{error}</pre>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col items-center space-y-4">
          <Button
            className="bg-primary hover:bg-primary/90 text-primary-foreground w-full"
            onClick={handleConfirmPayment}
            disabled={loading || timer === 0 || paymentConfirmed}
          >
            {loading ? "Processing Payment..." : paymentConfirmed ? "Payment Confirmed" : "Confirm Payment"}
          </Button>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => router.push("/")}
            disabled={loading}
          >
            Cancel
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}