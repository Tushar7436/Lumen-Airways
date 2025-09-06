"use client"

import { useState } from "react"
import { Button } from "@/(components)/ui/button"
import { Input } from "@/(components)/ui/input"
import { Label } from "@/(components)/ui/label"
import { Checkbox } from "@/(components)/ui/checkbox"
import { ArrowLeftRight, ArrowUpDown, Calendar, Users } from "lucide-react"
import DatePickerModal from "@/(components)/ui/date-picker-modal"
import PassengerModal from "@/(components)/ui/passenger-modal"

export default function FlightSearchForm() {
  const [fromLocation, setFromLocation] = useState("India (IN)")
  const [toLocation, setToLocation] = useState("")
  const [departDate, setDepartDate] = useState("10/09/2025")
  const [passengers, setPassengers] = useState({ adults: 1, children: 0 })
  const [cabinClass, setCabinClass] = useState("Economy")
  const [addNearbyAirports, setAddNearbyAirports] = useState(false)
  const [directFlights, setDirectFlights] = useState(false)
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [showPassengerModal, setShowPassengerModal] = useState(false)

  const handleSwapLocations = () => {
    const temp = fromLocation
    setFromLocation(toLocation)
    setToLocation(temp)
  }

  const handleDateSelect = (date: string) => {
    setDepartDate(date)
    setShowDatePicker(false)
  }

  const handlePassengerUpdate = (adults: number, children: number, cabin: string) => {
    setPassengers({ adults, children })
    setCabinClass(cabin)
    setShowPassengerModal(false)
  }

  const getPassengerText = () => {
    const total = passengers.adults + passengers.children
    if (total === 1) {
      return `1 Adult, ${cabinClass}`
    }
    return `${total} Travellers, ${cabinClass}`
  }

  return (
    <>
      <div className="bg-slate-800 text-white p-6">
        <div className="max-w-6xl mx-auto">
          {/* Main Search Form */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-0 bg-white rounded-lg overflow-hidden">
            {/* From Field */}
            <div className="relative p-4 border-r border-gray-200">
              <Label className="text-sm text-gray-600 mb-1">From</Label>
              <Input
                value={fromLocation}
                onChange={(e) => setFromLocation(e.target.value)}
                className="border-0 p-0 text-gray-900 font-medium focus-visible:ring-0"
                placeholder="Country, city or airport"
              />
            </div>

            <div className="flex items-center justify-center p-2 border-r border-gray-200">
              <Button
                variant="outline"
                size="icon"
                onClick={handleSwapLocations}
                className="bg-white border-2 border-gray-300 rounded-full w-10 h-10"
              >
                <ArrowLeftRight className="h-4 w-4" />
              </Button>
            </div>

            <div className="relative p-4 pl-2 border-r border-gray-200">
              <Label className="text-sm text-gray-600 mb-1">To</Label>
              <Input
                value={toLocation}
                onChange={(e) => setToLocation(e.target.value)}
                className="border-0 p-0 text-gray-900 font-medium focus-visible:ring-0"
                placeholder="Country, city or airport"
              />
            </div>

            {/* Depart Date */}
            <div
              className="relative p-4 border-r border-gray-200 cursor-pointer"
              onClick={() => setShowDatePicker(true)}
            >
              <Label className="text-sm text-gray-600 mb-1">Depart</Label>
              <div className="flex items-center gap-2">
                <span className="text-gray-900 font-medium">{departDate}</span>
              </div>
            </div>

            {/* Travellers and Cabin Class */}
            <div className="relative p-4 cursor-pointer" onClick={() => setShowPassengerModal(true)}>
              <Label className="text-sm text-gray-600 mb-1">Travellers and cabin class</Label>
              <div className="flex items-center gap-2">
                <span className="text-gray-900 font-medium">{getPassengerText()}</span>
              </div>
            </div>
          </div>

          {/* Options and Search */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mt-4 gap-4">

            <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg font-medium">Search</Button>
          </div>
        </div>
      </div>

      {/* Modals */}
      <DatePickerModal
        isOpen={showDatePicker}
        onClose={() => setShowDatePicker(false)}
        onDateSelect={handleDateSelect}
        selectedDate={departDate}
        tripType="one-way"
      />

      <PassengerModal
        isOpen={showPassengerModal}
        onClose={() => setShowPassengerModal(false)}
        onUpdate={handlePassengerUpdate}
        adults={passengers.adults}
        children={passengers.children}
        cabinClass={cabinClass}
      />
    </>
  )
}
