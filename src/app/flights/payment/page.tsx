"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/(components)/ui/card";
import { Button } from "@/(components)/ui/button";
import api from "@/lib/axios";

function PaymentPageComponent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentDetails, setPaymentDetails] = useState<{ bookingId: string; amount: number; status: string } | null>(null);
  const [timer, setTimer] = useState(420); // 7 minutes
  const [paymentResponse, setPaymentResponse] = useState<any>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);

  // --- init ---
  const userId = typeof window !== "undefined" ? localStorage.getItem("user_id") : null;

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

  // --- timer effect ---
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
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [router, paymentConfirmed]);

  // format timer mm:ss
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  // --- confirm payment ---
  const handleConfirmPayment = async () => {
    if (!paymentDetails) return;

    setLoading(true);
    setError(null);
    setPaymentResponse(null);

    try {
      if (!userId) throw new Error("User ID not found");

      const jwt = localStorage.getItem("jwt_token");
      const recipientEmail = localStorage.getItem("recipientEmail");

      // Load Razorpay SDK
      const loadRazorpayScript = () => {
        return new Promise<boolean>((resolve) => {
          const existingScript = document.querySelector(
            'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
          );
          if (existingScript) return resolve(true);

          const script = document.createElement("script");
          script.src = "https://checkout.razorpay.com/v1/checkout.js";
          script.onload = () => resolve(true);
          script.onerror = () => resolve(false);
          document.body.appendChild(script);
        });
      };

      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) throw new Error("Razorpay SDK failed to load");


      // Step 1: create Razorpay order from backend
      const paymentData = {
        totalCost: paymentDetails.amount,
        userId: Number(userId),
        bookingId: Number(paymentDetails.bookingId),
        recipientEmail,
      };

      const res = await api.post(
        "/bookingService/api/v1/bookings/payments",
        paymentData,
        { headers: { "x-idempotency-key": jwt || "" } }
      );

      const { orderId, amount, currency, key, bookingId } = res.data.data;

      // Step 2: open Razorpay checkout
      const options = {
        key,
        amount,
        currency,
        name: "Flight Booking",
        description: `Booking ID: ${bookingId}`,
        order_id: orderId,
        handler: async function (response: any) {
          try {
            console.log("verifyRessssssssssssssssssss");
            // Step 3: verify payment with backen
            const verifyRes = await api.post(
              "/bookingService/api/v1/bookings/verifyPayment",
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                bookingId,
                recipientEmail,
              },
            );
            console.log("verifyRessssssssssssssssssss",verifyRes.data);
            setPaymentResponse(verifyRes.data);
            console.log("verifyRessssssssssssssssssss",verifyRes.data);
            setPaymentConfirmed(true);
          } catch (verifyErr: any) {
            setError(
              verifyErr.response?.data?.message ||
                verifyErr.message ||
                "Payment verification failed"
            );
          }
        },
        theme: { color: "#3399cc" },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Payment failed");
    } finally {
      setLoading(false);
    }
  };

  // --- states ---
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
            <Button className="mt-4" variant="outline" onClick={() => router.push("/")}>
              Return to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // --- UI ---
  return (
    <div className="container mx-auto p-8">
      <Card>
        <CardHeader>
          <CardTitle>Payment</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center text-lg font-semibold">
            Time left to complete payment:{" "}
            <span className="text-red-600">{formatTime(timer)}</span>
          </div>
          <div className="space-y-2">
            <div>
              Booking ID: <span className="font-bold">{paymentDetails.bookingId}</span>
            </div>
            <div>
              Amount: <span className="font-bold">₹{paymentDetails.amount}</span>
            </div>
            <div>
              Status: <span className="font-bold">{paymentDetails.status}</span>
            </div>
          </div>

          {paymentResponse && (
            <div className="mt-4 p-4 border rounded bg-green-50 text-green-700">
              <div className="font-bold mb-2">Payment Response:</div>
              <pre className="text-xs whitespace-pre-wrap">
                {JSON.stringify(paymentResponse, null, 2)}
              </pre>
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
            {loading
              ? "Processing Payment..."
              : paymentConfirmed
              ? "Payment Confirmed"
              : "Confirm Payment"}
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

export default function PaymentPage() {
  return (
    <Suspense fallback={<div>Loading payment...</div>}>
      <PaymentPageComponent />
    </Suspense>
  );
}
