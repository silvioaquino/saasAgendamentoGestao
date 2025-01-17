"use client"
import { Calendar } from "@/app/_components/ui/calendar"
import { Booking } from "@prisma/client"
import { ptBR } from "date-fns/locale"
import { useEffect, useState } from "react"
import { getBookingsList } from "./booking-list-concluded"

const Calendario = () => {
  const [selectedDay, setSelectedDay] = useState<Date | undefined>(undefined)
  const [dayBookings, setDayBookings] = useState<Booking[]>([])

  console.log(dayBookings)

  useEffect(() => {
    if (!selectedDay) {
      return
    }

    const refreshAvailableHours = async () => {
      const _dayBookings = await getBookingsList(selectedDay)
      setDayBookings(_dayBookings)
    }
    refreshAvailableHours()
  }, [selectedDay])

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDay(date)
  }

  console.log(selectedDay)

  return (
    <div className="border-b border-solid py-5">
      <Calendar
        mode="single"
        locale={ptBR}
        selected={selectedDay}
        onSelect={handleDateSelect}
        fromDate={new Date()}
        styles={{
          head_cell: {
            width: "100%",
            textTransform: "capitalize",
          },
          cell: {
            width: "100%",
          },
          button: {
            width: "100%",
          },
          nav_button_previous: {
            width: "32px",
            height: "32px",
          },
          nav_button_next: {
            width: "32px",
            height: "32px",
          },
          caption: {
            textTransform: "capitalize",
          },
        }}
      />
    </div>
  )
}

export default Calendario
