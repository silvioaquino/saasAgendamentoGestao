"use client"
import Header from "../_components/header"
import { Calendar } from "../_components/ui/calendar"
import { ptBR } from "date-fns/locale"
import { useEffect, useState } from "react"
import { Booking } from "@prisma/client"
import { getBookingsListConcluded } from "./_components/booking-list-concluded"
import { getBookingsListConfirmed } from "./_components/booking-list-confirmed"
import BookingItemAdm from "./_components/booking-item-adm"

//interface ServiceItemProps {
//service: BarbershopService
//barbershop: Pick<Barbershop, "name">
//}

const Administrador = () => {
  // Recuperar a sessão do usuário (ver se ele estar logado ou não)
  //const session = await getServerSession(authOptions)
  //Se ele não estiver logado, redirecionar para a página de login
  //if (!session?.user) {
  //return notFound()
  //}

  const [selectedDay, setSelectedDay] = useState<Date | undefined>(undefined)
  const [confirmedBookings, setconfirmedBookings] = useState<Booking[]>([])
  const [concludedBookings, setconcludedBookings] = useState<Booking[]>([])

  console.log(confirmedBookings)

  useEffect(() => {
    if (!selectedDay) {
      return
    }

    const refreshAvailableHours = async () => {
      const _dayBookings = await getBookingsListConfirmed(selectedDay)
      setconcludedBookings(_dayBookings)
    }
    refreshAvailableHours()
  }, [selectedDay])

  useEffect(() => {
    if (!selectedDay) {
      return
    }

    const refreshAvailableHours = async () => {
      const _dayBookings = await getBookingsListConcluded(selectedDay)
      setconfirmedBookings(_dayBookings)
    }
    refreshAvailableHours()
  }, [selectedDay])

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDay(date)
  }

  console.log(selectedDay)

  return (
    <>
      <Header />

      <div className="px-5 py-6">
        <h1 className="text-center text-xl font-bold">Agendamentos</h1>

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

        {/*{confirmedBookings.length === 0 && concludedBookings.length === 0 && (
          <p className="text-gray-400">Você não tem agendamentos.</p>
        )}
        {confirmedBookings.length > 0 && (
          <>
            <h2 className="mb-3 mt-6 text-xs font-bold uppercase text-gray-400">
              Confirmados
            </h2>
            {confirmedBookings.map((booking) => (
              <BookingItem
                key={booking.id}
                booking={JSON.parse(JSON.stringify(booking))}
              />
            ))}
          </>
        )}
        {concludedBookings.length > 0 && (
          <>
            <h2 className="mb-3 mt-6 text-xs font-bold uppercase text-gray-400">
              Finalizados
            </h2>
            {concludedBookings.map((booking) => (
              <BookingItem
                key={booking.id}
                booking={JSON.parse(JSON.stringify(booking))}
              />
            ))}
          </>
        )}*/}

        <h2 className="mb-2 mt-2 text-center text-xl font-bold">Confirmados</h2>

        {confirmedBookings.map((booking) => (
          <BookingItemAdm
            key={booking.id}
            booking={JSON.parse(JSON.stringify(booking))}
          />
        ))}

        <h2 className="mb-2 mt-2 text-center text-xl font-bold">Finalizados</h2>

        {concludedBookings.map((booking) => (
          <BookingItemAdm
            key={booking.id}
            booking={JSON.parse(JSON.stringify(booking))}
          />
        ))}
      </div>
    </>
  )
}

export default Administrador
