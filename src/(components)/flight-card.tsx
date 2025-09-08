"use client"

import { Button } from "@/(components)/ui/button"
import { Card, CardContent } from "@/(components)/ui/card"
import { Heart, ArrowRight } from "lucide-react"
import type { Flight } from "@/types/flight"

interface FlightCardProps {
  flight: Flight
  onSelect?: (flightId: string) => void
  travellers?: string
}

export function FlightCard({ flight, onSelect, travellers }: FlightCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          {/* Flight Details */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
            {/* Airline and Flight Info */}
            <div className="flex flex-col space-y-2">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center text-white text-xs font-bold">
                  {flight.airline.code}
                </div>
                <span className="text-sm text-muted-foreground">{flight.airline.name}</span>
              </div>
              <div className="text-xs text-muted-foreground">
                <span className="font-medium">Flight:</span> {flight.flightNumber || `${flight.carrier} ${flight.id}`}
              </div>
            </div>

            {/* Times */}
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <div className="text-lg font-semibold">{flight.departure.time}</div>
                <div className="text-sm text-muted-foreground">{flight.departure.airport.code}</div>
                <div className="text-xs text-muted-foreground">{flight.departure.airport.name}</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-xs text-muted-foreground">{flight.duration}</div>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
                <div className="text-xs text-muted-foreground">
                  {flight.stops === 0 ? "Direct" : `${flight.stops} stop${flight.stops > 1 ? "s" : ""}`}
                </div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold">{flight.arrival.time}</div>
                <div className="text-sm text-muted-foreground">{flight.arrival.airport.code}</div>
                <div className="text-xs text-muted-foreground">{flight.arrival.airport.name}</div>
              </div>
            </div>

            {/* Stop Details */}
            <div className="text-sm text-muted-foreground">
              {flight.stops > 0 && flight.stopDetails && flight.stopDetails.length > 0 && (
                <div>{flight.stopDetails.join(", ")}</div>
              )}
            </div>

            {/* Price and Actions */}
            <div className="flex items-center justify-between">
              <div className="text-right">
                {flight.deals && flight.deals.length > 0 && (
                  <div className="text-xs text-secondary mb-1">{flight.deals.join(", ")}</div>
                )}
                <div className="text-2xl font-bold">₹{flight.price.amount.toLocaleString()}</div>
              </div>
              <div className="flex items-center space-x-2 ml-4">
                <Button variant="ghost" size="sm">
                  <Heart className="h-4 w-4" />
                </Button>
                <Button
                  onClick={() => {
                    if (onSelect) {
                      onSelect(flight.id);
                    } else {
                      // Create URL with encoded flight data
                      const params = new URLSearchParams({
                        flightData: encodeURIComponent(JSON.stringify(flight)),
                        travellers: travellers || "1"
                      });
                      window.location.href = `/flights/summary?${params.toString()}`;
                    }
                  }}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  Select
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}