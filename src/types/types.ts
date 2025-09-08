// src/types/flight.ts
export interface Flight {
    id: string;
    airline: string;
    price: number;
    departTime: string;
    arrivalTime: string;
    from: string; // destinationId
    to: string;   // arrivalId
    duration: string;
    stops: number;
  }
  
  export interface Passenger {
    adults: number;
    children: number;
    cabinClass: string;
  }
  