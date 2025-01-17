import Header from "../_components/header"
import Image from "next/image"
import { db } from "../_lib/prisma"
import PhoneItem from "../_components/phone-item"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { getServerSession } from "next-auth"
import { authOptions } from "../_lib/auth"
import Search from "../_components/search"
import { getConfirmedBookings } from "../_data/get-confirmed-bookings"
import BookingItem from "../_components/booking-item"
import ServiceItemNoLogin from "./_components/service-item-no-login"

interface BarbershopDetailsPageProps {
  params: {
    id?: string
  }
}

const Home = async ({ params }: BarbershopDetailsPageProps) => {
  if (!params.id) {
    // TODO: redirecionar para home page
    return null
  }

  const session = await getServerSession(authOptions)
  const confirmedBookings = await getConfirmedBookings()
  //chamar meu banco de dados
  const barbershops = await db.barbershop.findUnique({
    where: {
      id: params.id,
    },
    include: {
      services: true,
    },
  })

  if (!barbershops) {
    // TODO: redirecionar para home page
    return null
  }

  return (
    <div>
      {/* Header */}
      <Header />
      <div className="p-5">
        {/* TEXTO */}
        <h2 className="text-xl font-bold">
          Olá, {session?.user ? session.user.name : "bem vindo"}!
        </h2>
        <p>
          <span className="capitalize">
            {format(new Date(), "EEEE, dd", { locale: ptBR })}
          </span>
          <span>&nbsp;de&nbsp;</span>
          <span className="capitalize">
            {format(new Date(), "MMMM", { locale: ptBR })}
          </span>
        </p>

        {/* BUSCA */}
        <div className="mt-6">
          <Search />
        </div>

        {/* IMAGEM */}
        <div className="relative mt-6 h-[150px] w-full">
          <Image
            alt="Agende no melhor com FSW Barber"
            src="/banner02.png"
            fill
            className="rounded-xl object-cover"
          />
        </div>

        {/* Agendamentos */}
        {confirmedBookings.length > 0 && (
          <>
            <h2 className="mb-3 mt-6 text-xs font-bold uppercase text-gray-400">
              Agendamentos
            </h2>

            {/* AGENDAMENTO */}
            <div className="flex gap-3 overflow-x-auto [&::-webkit-scrollbar]:hidden">
              {confirmedBookings.map((booking) => (
                <BookingItem
                  key={booking.id}
                  booking={JSON.parse(JSON.stringify(booking))}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* DESCRIÇÃO */}
      <div className="space-y-2 border-b border-solid p-5">
        <h2 className="text-lx font-bold uppercase text-gray-400">Sobre</h2>
        <p className="text-justify text-sm">{barbershops?.description}</p>
      </div>

      {/* SERVIÇOS */}
      <div className="space-y-3 border-b border-solid p-5">
        <h2 className="text-lx font-bold uppercase text-gray-400">Serviços</h2>
        <div className="space-y-3">
          {barbershops.services.map((service) => (
            <ServiceItemNoLogin
              key={service.id}
              barbershop={JSON.parse(JSON.stringify(barbershops))}
              service={JSON.parse(JSON.stringify(service))}
            />
          ))}
        </div>
      </div>

      {/* CONTATO */}
      <div className="space-y-3 p-5">
        {barbershops.phones.map((phone) => (
          <PhoneItem key={phone} phone={phone} />
        ))}
      </div>
    </div>
  )
}

export default Home
