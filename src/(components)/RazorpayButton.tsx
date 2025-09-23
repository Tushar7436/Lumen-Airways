"use client";

import { useState } from "react";
import api from "@/lib/axios";
import { Button } from "@/(components)/ui/button";

interface RazorpayButtonProps {
  bookingId: string;
  amount: number;
  userId: string;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

const loadRazorpayScript = () => {
  return new Promise<boolean>((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export default function RazorpayButton({
  bookingId,
  amount,
  userId,
  onSuccess,
  onError,
}: RazorpayButtonProps) {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    try {
      const resScript = await loadRazorpayScript();
      if (!resScript) throw new Error("Razorpay SDK failed to load");

      // Call backend to create Razorpay order
      const orderResponse = await api.post("/bookingService/api/v1/bookings/razorpay-order", {
        bookingId,
        amount: amount * 100, // paise
        userId: Number(userId),
      });

      const { id: order_id, currency, amount: orderAmount } = orderResponse.data;

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY,
        amount: orderAmount,
        currency,
        name: "Your Company Name",
        description: `Booking ID: ${bookingId}`,
        order_id,
        handler: async function (response: any) {
          try {
            // Verify payment on backend
            await api.post("/bookingService/api/v1/bookings/verify-payment", {
              ...response,
              bookingId,
              userId: Number(userId),
            });
            onSuccess && onSuccess();
            alert("Payment successful!");
          } catch (err: any) {
            onError && onError(err.response?.data?.message || "Payment verification failed");
          }
        },
        prefill: {
          name: localStorage.getItem("user_name") || "",
          email: localStorage.getItem("recipientEmail") || "",
          contact: localStorage.getItem("user_contact") || "",
        },
        theme: {
          color: "#3399cc",
        },
      };

      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.open();
    } catch (err: any) {
      onError && onError(err.message || "Payment failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      className="bg-primary hover:bg-primary/90 text-primary-foreground w-full"
      onClick={handlePayment}
      disabled={loading}
    >
      {loading ? "Processing..." : "Pay with Razorpay"}
    </Button>
  );
}
