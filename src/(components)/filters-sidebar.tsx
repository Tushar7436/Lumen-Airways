"use client"

import { useState } from "react"
import { Button } from "@/(components)/ui/button"
import { Checkbox } from "@/(components)/ui/checkbox"
import { Label } from "@/(components)/ui/label"
import { Slider } from "@/(components)/ui/slider"
import { Card, CardContent, CardHeader, CardTitle } from "@/(components)/ui/card"
import type { FilterOptions } from "@/types/flight"

interface FiltersSidebarProps {
  filters: FilterOptions
  onFiltersChange: (filters: FilterOptions) => void
}

export function FiltersSidebar({ filters, onFiltersChange }: FiltersSidebarProps) {
  const [isOpen, setIsOpen] = useState(false)

  const airlines = [
    { code: "AI", name: "Air India", count: 12 },
    { code: "6E", name: "IndiGo", count: 8 },
    { code: "SG", name: "SpiceJet", count: 6 },
    { code: "UK", name: "Vistara", count: 4 },
  ]

  return (
    <>
      {/* Mobile Filter Toggle */}
      <div className="md:hidden mb-4">
        <Button variant="outline" onClick={() => setIsOpen(!isOpen)} className="w-full">
          Filters
        </Button>
      </div>

      {/* Filters */}
      <div className={`space-y-6 ${isOpen ? "block" : "hidden md:block"}`}>
        {/* Stops */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Stops</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="direct"
                checked={filters.stops.includes("direct")}
                onCheckedChange={(checked) => {
                  const newStops = checked ? [...filters.stops, "direct"] : filters.stops.filter((s) => s !== "direct")
                  onFiltersChange({ ...filters, stops: newStops })
                }}
              />
              <Label htmlFor="direct" className="flex-1">
                Direct
              </Label>
              <span className="text-sm text-muted-foreground">from ₹11,636</span>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="1stop"
                checked={filters.stops.includes("1stop")}
                onCheckedChange={(checked) => {
                  const newStops = checked ? [...filters.stops, "1stop"] : filters.stops.filter((s) => s !== "1stop")
                  onFiltersChange({ ...filters, stops: newStops })
                }}
              />
              <Label htmlFor="1stop" className="flex-1">
                1 stop
              </Label>
              <span className="text-sm text-muted-foreground">from ₹9,812</span>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="2stops"
                checked={filters.stops.includes("2+stops")}
                onCheckedChange={(checked) => {
                  const newStops = checked
                    ? [...filters.stops, "2+stops"]
                    : filters.stops.filter((s) => s !== "2+stops")
                  onFiltersChange({ ...filters, stops: newStops })
                }}
              />
              <Label htmlFor="2stops" className="flex-1">
                2+ stops
              </Label>
              <span className="text-sm text-muted-foreground">None</span>
            </div>
          </CardContent>
        </Card>

        {/* Departure Time */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Departure times</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Outbound</Label>
                <div className="mt-2">
                  <Slider
                    value={filters.departureTime}
                    onValueChange={(value) => onFiltersChange({ ...filters, departureTime: value as [number, number] })}
                    max={24}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>00:00</span>
                    <span>23:59</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Airlines */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Airlines</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {airlines.map((airline) => (
              <div key={airline.code} className="flex items-center space-x-2">
                <Checkbox
                  id={airline.code}
                  checked={filters.airlines.includes(airline.code)}
                  onCheckedChange={(checked) => {
                    const newAirlines = checked
                      ? [...filters.airlines, airline.code]
                      : filters.airlines.filter((a) => a !== airline.code)
                    onFiltersChange({ ...filters, airlines: newAirlines })
                  }}
                />
                <Label htmlFor={airline.code} className="flex-1">
                  {airline.name}
                </Label>
                <span className="text-sm text-muted-foreground">{airline.count}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Baggage */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Baggage</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="cabin-bag"
                checked={filters.baggage.includes("cabin")}
                onCheckedChange={(checked) => {
                  const newBaggage = checked
                    ? [...filters.baggage, "cabin"]
                    : filters.baggage.filter((b) => b !== "cabin")
                  onFiltersChange({ ...filters, baggage: newBaggage })
                }}
              />
              <Label htmlFor="cabin-bag">Cabin bag</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="checked-bag"
                checked={filters.baggage.includes("checked")}
                onCheckedChange={(checked) => {
                  const newBaggage = checked
                    ? [...filters.baggage, "checked"]
                    : filters.baggage.filter((b) => b !== "checked")
                  onFiltersChange({ ...filters, baggage: newBaggage })
                }}
              />
              <Label htmlFor="checked-bag">Checked bag</Label>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
