"use client";

import { useCallback, useState } from "react";

type PaymentReceiptProps = {
  bookingId: string;
  amount: number;
  status: string;
  bookingDetails?: any | null;
};

export default function PaymentReceipt({ bookingId, amount, status, bookingDetails }: PaymentReceiptProps) {
  const [downloading, setDownloading] = useState(false);

  const handleDownload = useCallback(async () => {
    setDownloading(true);
    try {
      const ensureJsPdf = async (): Promise<any | null> => {
        const w = window as any;
        if (w.jspdf?.jsPDF) return w.jspdf.jsPDF;
        // load from CDN
        await new Promise<void>((resolve, reject) => {
          const existing = document.querySelector<HTMLScriptElement>('script[data-lib="jspdf"]');
          if (existing) {
            existing.addEventListener("load", () => resolve());
            existing.addEventListener("error", () => reject(new Error("Failed to load jsPDF")));
            return;
          }
          const s = document.createElement("script");
          s.src = "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";
          s.async = true;
          s.crossOrigin = "anonymous";
          s.setAttribute("data-lib", "jspdf");
          s.onload = () => resolve();
          s.onerror = () => reject(new Error("Failed to load jsPDF"));
          document.body.appendChild(s);
        });
        return (window as any).jspdf?.jsPDF || null;
      };

      const JsPDFCtor = await ensureJsPdf();
      if (!JsPDFCtor) { window.print(); return; }

      const doc = new JsPDFCtor();

      const now = new Date();
      const userId = typeof window !== "undefined" ? localStorage.getItem("user_id") : null;
      const recipientEmail = typeof window !== "undefined" ? localStorage.getItem("recipientEmail") : null;

      let y = 20;
      doc.setFontSize(18);
      doc.text("Payment Receipt", 14, y);
      y += 10;

      doc.setFontSize(12);
      doc.text(`Generated: ${now.toLocaleString()}`, 14, y); y += 8;
      doc.text(`Booking ID: ${bookingId}`, 14, y); y += 8;
      doc.text(`Amount: ₹${amount}`, 14, y); y += 8;
      doc.text(`Status: ${status}`, 14, y); y += 8;
      if (userId) { doc.text(`User ID: ${userId}`, 14, y); y += 8; }
      if (recipientEmail) { doc.text(`Email: ${recipientEmail}`, 14, y); y += 8; }

      if (bookingDetails) {
        y += 4;
        doc.setFontSize(14);
        doc.text("Flight Details", 14, y); y += 8;
        doc.setFontSize(12);
        try {
          const dep = bookingDetails?.flight?.departure_airport || bookingDetails?.departure_airport;
          const arr = bookingDetails?.flight?.arrival_airport || bookingDetails?.arrival_airport;
          const flightNumber = bookingDetails?.flight?.flightNumber || bookingDetails?.flightNumber;
          const depTime = bookingDetails?.flight?.departureTime || bookingDetails?.departureTime;
          const arrTime = bookingDetails?.flight?.arrivalTime || bookingDetails?.arrivalTime;
          const noOfSeats = bookingDetails?.noOfSeats || bookingDetails?.passengers || 1;

          if (flightNumber) { doc.text(`Flight: ${flightNumber}`, 14, y); y += 8; }
          if (dep && arr) {
            const depCode = dep?.code || bookingDetails?.departureCode || "";
            const arrCode = arr?.code || bookingDetails?.arrivalCode || "";
            const depCity = dep?.City?.name || dep?.city || dep?.name || "";
            const arrCity = arr?.City?.name || arr?.city || arr?.name || "";
            doc.text(`Route: ${depCity} (${depCode}) → ${arrCity} (${arrCode})`, 14, y); y += 8;
          }
          if (depTime && arrTime) {
            doc.text(`Departure: ${new Date(depTime).toLocaleString()}`, 14, y); y += 8;
            doc.text(`Arrival: ${new Date(arrTime).toLocaleString()}`, 14, y); y += 8;
          }
          doc.text(`Passengers: ${noOfSeats}`, 14, y); y += 8;
        } catch {}
      }

      doc.save(`receipt_${bookingId}.pdf`);
    } finally {
      setDownloading(false);
    }
  }, [bookingId, amount, status, bookingDetails]);

  return (
    <div className="w-full">
      <button
        onClick={handleDownload}
        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 px-4 rounded-md font-medium transition-colors"
        disabled={downloading}
      >
        {downloading ? "Preparing PDF..." : "Download Receipt (PDF)"}
      </button>
    </div>
  );
}


