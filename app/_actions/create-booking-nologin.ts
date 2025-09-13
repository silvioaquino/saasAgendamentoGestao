"use server"

import { revalidatePath } from "next/cache"
import { db } from "../_lib/prisma"

interface CreateBookingParams {
  serviceId: string
  date: Date
  name: string
  phone: string
}

export const createBookingNoLogin = async (params: CreateBookingParams) => {
  await db.booking.create({
    data: { ...params },
  })
  revalidatePath("/barbershops/[id]")
}
