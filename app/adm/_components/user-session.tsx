import { authOptions } from "@/app/_lib/auth"
import { getServerSession } from "next-auth"
import { useSession } from "next-auth/react"

export const getUserSession = async () => {
  {
    /*const session = await getServerSession(authOptions)
    return session*/
  }

  const { data } = useSession()
  const userS = data.user.name
  return userS
}
