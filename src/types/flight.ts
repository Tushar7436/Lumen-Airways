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
export interface Deal {
  city: string;
  country: string;
  img: string;
  flights: Flight[];
  price: string;
}
 
export interface FlightApiResponse{
  success: boolean;
  data: any[]; 
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
  flightNumber?: string; // Added this field
  airline: {
    code: string;
    name: string;
  };
  departure: {
    time: string;
    airport: {
      code: string;
      name: string;
      city: string;
    };
  };
  arrival: {
    time: string;
    airport: {
      code: string;
      name: string;
      city: string;
    };
  };
  duration: string;
  stops: number;
  stopDetails: any[];
  price: {
    amount: number;
    currency: string;
  };
  deals: any[];
  from: string;
  to: string;
  departureAirportId: string;
  arrivalAirportId: string;
  departureTime: string;
  arrivalTime: string;
  fare: number;
  carrier: string;
}

export interface FilterOptions {
  stops: string[];
  departureTime: [number, number];
  airlines: string[];
  baggage: string[];
}

export type { Flight as default };