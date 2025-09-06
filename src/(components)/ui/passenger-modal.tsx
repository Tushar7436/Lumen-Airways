"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/(components)/ui/dialog"
import { Button } from "@/(components)/ui/button"
import { Minus, Plus } from "lucide-react"

interface PassengerModalProps {
  isOpen: boolean
  onClose: () => void
  onUpdate: (adults: number, children: number, cabinClass: string) => void
  adults: number
  children: number
  cabinClass: string
}

export default function PassengerModal({
  isOpen,
  onClose,
  onUpdate,
  adults,
  children,
  cabinClass,
}: PassengerModalProps) {
  const [localAdults, setLocalAdults] = useState(adults)
  const [localChildren, setLocalChildren] = useState(children)
  const [localCabinClass, setLocalCabinClass] = useState(cabinClass)

  const handleApply = () => {
    onUpdate(localAdults, localChildren, localCabinClass)
  }

  const incrementAdults = () => {
    if (localAdults < 9) setLocalAdults(localAdults + 1)
  }

  const decrementAdults = () => {
    if (localAdults > 1) setLocalAdults(localAdults - 1)
  }

  const incrementChildren = () => {
    if (localChildren < 9) setLocalChildren(localChildren + 1)
  }

  const decrementChildren = () => {
    if (localChildren > 0) setLocalChildren(localChildren - 1)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Cabin class</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-700 mb-2">We can only show Economy prices for this search.</p>
            <p className="text-sm text-gray-600">
              To see Business, Premium Economy, and First Class options, please tell us your travel dates and
              destination.
            </p>
          </div>

          {/* Adults Counter */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-900">Adults</h3>
              <p className="text-sm text-gray-600">Aged 18+</p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                onClick={decrementAdults}
                disabled={localAdults <= 1}
                className="h-10 w-10 rounded-full bg-gray-100 border-gray-300"
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="text-lg font-semibold w-8 text-center">{localAdults}</span>
              <Button
                variant="outline"
                size="icon"
                onClick={incrementAdults}
                disabled={localAdults >= 9}
                className="h-10 w-10 rounded-full bg-gray-100 border-gray-300"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Children Counter */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-900">Children</h3>
              <p className="text-sm text-gray-600">Aged 0 to 17</p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                onClick={decrementChildren}
                disabled={localChildren <= 0}
                className="h-10 w-10 rounded-full bg-gray-100 border-gray-300"
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="text-lg font-semibold w-8 text-center">{localChildren}</span>
              <Button
                variant="outline"
                size="icon"
                onClick={incrementChildren}
                disabled={localChildren >= 9}
                className="h-10 w-10 rounded-full bg-gray-100 border-gray-300"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-3 text-sm text-gray-600">
            <p>
              Your age at time of travel must be valid for the age category booked. Airlines have restrictions on under
              18s travelling alone.
            </p>
            <p>
              Age limits and policies for travelling with children may vary so please check with the airline before
              booking.
            </p>
          </div>

          <Button onClick={handleApply} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
            Apply
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
