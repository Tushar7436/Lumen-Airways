"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader,DialogTitle } from "@/(components)/ui/dialog"
import { Button } from "@/(components)/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface DatePickerModalProps {
  isOpen: boolean
  onClose: () => void
  onDateSelect: (date: string) => void
  selectedDate: string
  tripType: string
  availableDates?: string[] // ISO dates: YYYY-MM-DD
}

export default function DatePickerModal({
  isOpen,
  onClose,
  onDateSelect,
  selectedDate,
  tripType,
  availableDates = [],
}: DatePickerModalProps) {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth())
  const [currentYear, setCurrentYear] = useState(today.getFullYear())
  const [dateType, setDateType] = useState("specific")

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (month: number, year: number) => {
    // Correctly get the day of the week, adjusted for the desired display (Monday-first)
    const day = new Date(year, month, 1).getDay();
    // Sunday is 0, so we convert it to 6, and shift all others by -1
    return day === 0 ? 6 : day - 1;
  }

  const generateCalendar = (month: number, year: number) => {
    const daysInMonth = getDaysInMonth(month, year)
    const firstDay = getFirstDayOfMonth(month, year)
    const days = []

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(null)
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day)
    }

    return days
  }

  const handleDateClick = (day: number, month: number, year: number) => {
    const date = `${day.toString().padStart(2, "0")}/${(month + 1).toString().padStart(2, "0")}/${year}`
    onDateSelect(date)
  }

  const navigateMonth = (direction: "prev" | "next") => {
    if (direction === "prev") {
      if (currentMonth === 0) {
        setCurrentMonth(11)
        setCurrentYear(currentYear - 1)
      } else {
        setCurrentMonth(currentMonth - 1)
      }
    } else {
      if (currentMonth === 11) {
        setCurrentMonth(0)
        setCurrentYear(currentYear + 1)
      } else {
        setCurrentMonth(currentMonth + 1)
      }
    }
  }

  const renderCalendar = (monthOffset = 0) => {
    const availableSet = new Set(availableDates)
    const month = (currentMonth + monthOffset) % 12
    const year = currentYear + Math.floor((currentMonth + monthOffset) / 12)
    const days = generateCalendar(month, year)
    const dayLabels = ["M", "T", "W", "T", "F", "S", "S"]

    // Parse the selectedDate string
    const [selectedDay, selectedMonth, selectedYear] = selectedDate
      ? selectedDate.split("/").map(Number)
      : [null, null, null];

    return (
      <div className="flex-1">
        <div className="flex items-center justify-center mb-4 relative">
          {monthOffset === 0 && (
            <Button variant="ghost" size="icon" onClick={() => navigateMonth("prev")} className="absolute left-0">
              <ChevronLeft className="h-4 w-4" />
            </Button>
          )}
          <h3 className="text-lg font-bold text-center">
            {months[month]} {year}
          </h3>
          {monthOffset === 1 && (
            <Button variant="ghost" size="icon" onClick={() => navigateMonth("next")} className="absolute right-0">
              <ChevronRight className="h-4 w-4" />
            </Button>
          )}
        </div>
        <div className="grid grid-cols-7 gap-1 mb-2">
          {dayLabels.map((label, index) => (
            <div key={index} className="text-center text-sm font-medium text-gray-500 p-3">
              {label}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-3">
          {days.map((day, index) => (
            <button
              key={index}
              onClick={() => day && handleDateClick(day, month, year)}
              className={`
                text-center text-sm rounded-full hover:bg-gray-300 transition-colors
                ${!day ? "invisible" : ""}
                ${(() => {
                  if (!day) return "";
                  const mm = String(month + 1).padStart(2, "0")
                  const dd = String(day).padStart(2, "0")
                  const iso = `${year}-${mm}-${dd}`
                  return availableSet.has(iso) ? "bg-emerald-100 text-emerald-900 ring-1 ring-emerald-300" : ""
                })()}
                ${day ? "hover:bg-gray-100" : ""}
              `}
              disabled={!day}
            >
              {day}
            </button>
          ))}
        </div>
      </div>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-9xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Select date</DialogTitle>
          <div className="flex items-center justify-between mb-4">
            <div className="flex gap-3">
              <Button
                variant={dateType === "specific" ? "default" : "outline"}
                onClick={() => setDateType("specific")}
                className="bg-slate-800 text-white"
              >
                Specific dates
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="flex gap-8 justify-center mb-6">
          {renderCalendar(0)}
          {renderCalendar(1)}
        </div>

        <div className="flex justify-between items-center">
          <Button onClick={onClose} className="bg-blue-900 text-white px-8">
            Apply
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
