// src/lib/api/ApiClient.ts

import type { Flight } from "@/types/flight";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api/v1/flights";

export async function getFlights(): Promise<Flight[]> {
  const res = await fetch(`${BASE_URL}/flights`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch flights");
  return res.json();
}

export async function getFlightsBySearch(
  from: string,
  to: string,
  date?: string
): Promise<Flight[]> {
  const params = new URLSearchParams({ from, to });
  if (date) params.append("date", date);

  const res = await fetch(`${BASE_URL}/flights/search?${params.toString()}`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch flights by search");
  return res.json();
}
