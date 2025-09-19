"use client"

import { Barbershop, BarbershopService, Booking } from "@prisma/client"
import Image from "next/image"
import { Button } from "../../_components/ui/button"
import { Card, CardContent } from "../../_components/ui/card"
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "../../_components/ui/sheet"
import { Calendar } from "../../_components/ui/calendar"
import { ptBR } from "date-fns/locale"
import { SetStateAction, useEffect, useMemo, useState } from "react"
import { isPast, isToday, set } from "date-fns"
//import { useSession } from "next-auth/react"
import { toast } from "sonner"
import { Dialog, DialogContent } from "../../_components/ui/dialog"
import SignInDialog from "../../_components/sign-in-dialog"
import BookingSummary from "../../_components/booking-summary"
import { useRouter } from "next/navigation"
import { Input } from "../../_components/ui/input"
import { createBookingNoLogin } from "../../_actions/create-booking-nologin"
import { getBookings } from "@/app/_actions/get-bookings"

interface ServiceItemProps {
  service: BarbershopService
  barbershop: Pick<Barbershop, "name">
}

const TIME_LIST = [
  "08:00",
  "08:30",
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
  "18:00",
]

interface GetTimeListProps {
  bookings: Booking[]
  selectedDay: Date
}

const getTimeList = ({ bookings, selectedDay }: GetTimeListProps) => {
  return TIME_LIST.filter((time) => {
    const hour = Number(time.split(":")[0])
    const minutes = Number(time.split(":")[1])

    const timeIsOnThePast = isPast(set(new Date(), { hours: hour, minutes }))
    if (timeIsOnThePast && isToday(selectedDay)) {
      return false
    }

    const hasBookingOnCurrentTime = bookings.some(
      (booking) =>
        booking.date.getHours() === hour &&
        booking.date.getMinutes() === minutes,
    )
    if (hasBookingOnCurrentTime) {
      return false
    }
    return true
  })
}

const ServiceItemNoLogin = ({ service, barbershop }: ServiceItemProps) => {
  //const { data } = useSession()
  const router = useRouter()
  const [signInDialogIsOpen, setSignInDialogIsOpen] = useState(false)
  const [selectedDay, setSelectedDay] = useState<Date | undefined>(undefined)
  const [selectedTime, setSelectedTime] = useState<string | undefined>(
    undefined,
  )
  const [dayBookings, setDayBookings] = useState<Booking[]>([])
  const [bookingSheetIsOpen, setBookingSheetIsOpen] = useState(false)

  //const nome = useState<string | undefined>('')
  const [nome, setNome] = useState("")
  const [phone, setTelefone] = useState("")
  const [, setMensagem] = useState("")

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault()

    // Aqui você pode enviar os dados para um servidor ou fazer outra ação
    setMensagem(`Nome: ${nome}, Telefone: ${phone}`)
    setNome("")
    setTelefone("")
    console.log(`Nome: ${setNome}, Telefone: ${setTelefone}`)
  }

  const handleNomeChange = (e: { target: { value: SetStateAction<string> } }) =>
    setNome(e.target.value)
  const handleTelefoneChange = (e: {
    target: { value: SetStateAction<string> }
  }) => setTelefone(e.target.value)
  //const phone = useState<string | undefined>('')

  {
    useEffect(() => {
      const fetch = async () => {
        if (!selectedDay) return
        const bookings = await getBookings({
          date: selectedDay,
          serviceId: service.id,
          serviceName: service.name,
          servicePrice: service.price,
          serviceTime: selectedDay,
        })
        setDayBookings(bookings)
      }
      fetch()
    }, [selectedDay, service.id, service.name])
  }

  const selectedDate = useMemo(() => {
    if (!selectedDay || !selectedTime) return
    return set(selectedDay, {
      hours: Number(selectedTime?.split(":")[0]),
      minutes: Number(selectedTime?.split(":")[1]),
    })
  }, [selectedDay, selectedTime])

  const handleBookingClick = () => {
    //if (data?.user) {
    //return setBookingSheetIsOpen(true)
    //}
    //return setSignInDialogIsOpen(true)
    return setBookingSheetIsOpen(true)
  }

  const handleBookingSheetOpenChange = () => {
    setSelectedDay(undefined)
    setSelectedTime(undefined)
    setDayBookings([])
    setBookingSheetIsOpen(false)
  }

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDay(date)
  }

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time)
  }

  const handleCreateBooking = async () => {
    try {
      if (!selectedDate) return
      await createBookingNoLogin({
        serviceId: service.id,
        date: selectedDate,
        name: nome,
        phone: phone,
        serviceName: service.name,
        servicePrice: service.price,
        serviceTime: selectedDate,
      })
      handleBookingSheetOpenChange()
      toast.success("Reserva criada com sucesso!", {
        action: {
          label: "Ver agendamentos",
          onClick: () => router.push("/bookings"),
        },
      })
    } catch (error) {
      console.error(error)
      toast.error("Erro ao criar reserva!")
    }
  }

  const timeList = useMemo(() => {
    if (!selectedDay) return []
    return getTimeList({
      bookings: dayBookings,
      selectedDay,
    })
  }, [dayBookings, selectedDay])

  return (
    <>
      <Card>
        <CardContent className="flex items-center gap-3 p-3">
          {/* IMAGE */}
          <div className="relative max-h-[110px] min-h-[110px] min-w-[110px] max-w-[110px]">
            <Image
              alt={service.name}
              src={service.imageUrl}
              fill
              className="rounded-lg object-cover"
            />
          </div>
          {/* DIREITA */}
          <div className="w-full space-y-2">
            <h3 className="text-sm font-semibold">{service.name}</h3>
            <p className="text-sm text-gray-400">{service.description}</p>
            {/* PREÇO E BOTÃO */}
            <div className="flex items-center justify-between">
              <p className="text-sm font-bold text-primary">
                {Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(Number(service.price))}
              </p>

              <Sheet
                open={bookingSheetIsOpen}
                onOpenChange={handleBookingSheetOpenChange}
              >
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleBookingClick}
                >
                  Reservar
                </Button>

                <SheetContent className="px-0">
                  <SheetHeader>
                    <SheetTitle>Fazer Reserva</SheetTitle>
                  </SheetHeader>

                  <div className="border-b border-solid py-4">
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

                  {selectedDay && (
                    <div className="flex gap-2 overflow-x-auto border-b border-solid p-3 [&::-webkit-scrollbar]:hidden">
                      {timeList.length > 0 ? (
                        timeList.map((time) => (
                          <Button
                            key={time}
                            variant={
                              selectedTime === time ? "default" : "outline"
                            }
                            className="rounded-full"
                            onClick={() => handleTimeSelect(time)}
                          >
                            {time}
                          </Button>
                        ))
                      ) : (
                        <p className="text-xs">
                          Não há horários disponíveis para este dia.
                        </p>
                      )}
                    </div>
                  )}
                  <form onSubmit={handleSubmit}>
                    <div className="grid grid-flow-col gap-2 p-2 py-3">
                      <Input
                        type="text"
                        id="nome"
                        name="nome"
                        value={nome}
                        onChange={handleNomeChange}
                        required
                        placeholder="Nome"
                      />

                      <Input
                        type="text"
                        id="telefone"
                        name="telefone"
                        value={phone}
                        onChange={handleTelefoneChange}
                        required
                        placeholder="Telefone"
                      />
                    </div>
                  </form>

                  {selectedDate && (
                    <div className="p-1">
                      <BookingSummary
                        barbershop={barbershop}
                        service={service}
                        selectedDate={selectedDate}
                      />
                    </div>
                  )}

                  <SheetFooter className="mt-2 px-5">
                    <Button
                      onClick={handleCreateBooking}
                      disabled={
                        !selectedDay || (!selectedTime && !nome) || !phone
                      }
                    >
                      Confirmar
                    </Button>
                  </SheetFooter>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog
        open={signInDialogIsOpen}
        onOpenChange={(open) => setSignInDialogIsOpen(open)}
      >
        <DialogContent className="w-[90%]">
          <SignInDialog />
        </DialogContent>
      </Dialog>
    </>
  )
}

export default ServiceItemNoLogin
