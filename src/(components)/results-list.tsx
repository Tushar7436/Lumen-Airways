"use client"

import { useState } from "react"
import { Button } from "@/(components)/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/(components)/ui/select"
import { FlightCard } from "./flight-card"
import type { Flight } from "@/types/flight"

interface ResultsListProps {
  flights: Flight[]
  isLoading?: boolean
}

export function ResultsList({ flights, isLoading }: ResultsListProps) {
  const [sortBy, setSortBy] = useState("cheapest")

  const sortedFlights = [...flights].sort((a, b) => {
    switch (sortBy) {
      case "cheapest":
        return a.price.amount - b.price.amount
      case "fastest":
        return Number.parseInt(a.duration) - Number.parseInt(b.duration)
      case "best":
        // Simple scoring: price + duration
        return (
          a.price.amount / 1000 + Number.parseInt(a.duration) - (b.price.amount / 1000 + Number.parseInt(b.duration))
        )
      default:
        return 0
    }
  })

  const handleFlightSelect = (flightId: string) => {
    console.log("Selected flight:", flightId)
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-24 bg-muted animate-pulse rounded-lg" />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Sort Bar */}
      <div className="flex items-center justify-between">
        <div className="flex space-x-4">
          <Button variant={sortBy === "best" ? "default" : "outline"} onClick={() => setSortBy("best")}>
            Best
            <span className="ml-2 text-sm">₹{Math.min(...flights.map((f) => f.price.amount)).toLocaleString()}</span>
          </Button>
          <Button variant={sortBy === "cheapest" ? "default" : "outline"} onClick={() => setSortBy("cheapest")}>
            Cheapest
            <span className="ml-2 text-sm">₹{Math.min(...flights.map((f) => f.price.amount)).toLocaleString()}</span>
          </Button>
          <Button variant={sortBy === "fastest" ? "default" : "outline"} onClick={() => setSortBy("fastest")}>
            Fastest
            <span className="ml-2 text-sm">₹{Math.min(...flights.map((f) => f.price.amount)).toLocaleString()}</span>
          </Button>
        </div>

        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="cheapest">Cheapest first</SelectItem>
            <SelectItem value="fastest">Fastest first</SelectItem>
            <SelectItem value="best">Best first</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Flight Results */}
      <div className="space-y-4">
        {sortedFlights.map((flight) => (
          <FlightCard key={flight.id} flight={flight} onSelect={handleFlightSelect} />
        ))}
      </div>

      {/* Load More */}
      <div className="text-center">
        <Button variant="outline">Load more results</Button>
      </div>
    </div>
  )
}
