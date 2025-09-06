// app/(components)/Footer.tsx
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-blue-950 text-white mt-12">
      <div className="text-center py-10 border-t border-gray-600 text-base">
        © FlightClone 2025 · All rights reserved
      </div>
    </footer>
  );
}