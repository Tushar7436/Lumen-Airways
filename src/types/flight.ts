// Domain model for flights used by the results UI

export interface AirlineInfo {
  code: string;
  name: string;
}

export interface AirportInfo {
  code: string;
  name?: string;
  city?: string;
}

export interface LegEndpoint {
  time: string; // e.g. "10:30"
  airport: AirportInfo;
}

export interface PriceInfo {
  amount: number; // in smallest currency unit or absolute, per API
  currency?: string; // e.g. "INR"
}

export interface Flight {
  id: string;
  airline: AirlineInfo;

  departure: LegEndpoint;
  arrival: LegEndpoint;

  duration: string; // e.g. "120" minutes or formatted string
  stops: number; // 0 = direct
  stopDetails?: string[]; // e.g. ["DEL", "BOM"]

  price: PriceInfo;
  deals?: string[]; // labels like ["Best", "Saver"]

  // Optional fields that may be present from backend responses
  from?: string;
  to?: string;
  departureAirportId?: string;
  arrivalAirportId?: string;
  departTime?: string;
  departureTime?: string;
  arrivalTime?: string;
  fare?: number;
  carrier?: string;
}

export interface FilterOptions {
  stops: string[];
  departureTime: [number, number];
  airlines: string[];
  baggage: string[];
}

export type { Flight as default };


