"use client"
// components/AuthenticatedHomeContent.tsx
import { useRouter } from "next/router"
import { useEffect } from "react"
import { useSession } from "next-auth/react"
import FidelityProgramSignup from "./fielidade"
import PremiumSubscription from "./assinatura"

const AuthenticatedHomeContent = () => {
  const { data: session, status } = useSession()
  //const router = useRouter();

  // Se não estiver autenticado e estiver na página inicial, não renderiza o conteúdo
  //if (status === 'unauthenticated' && router.pathname === '/') {
  // return null;
  //}

  // Se a sessão estiver carregando
  if (status === "loading") {
    return <div>Carregando...</div>
  }

  // Conteúdo que só aparece para usuários autenticados na página inicial
  if (status === "authenticated") {
    return (
      <div className="authenticated-content">
        <h1>Bem-vindo, {session?.user?.name}!</h1>
        <p>
          Este conteúdo só é visível porque você está autenticado na página
          principal.
        </p>

        <FidelityProgramSignup />

        <PremiumSubscription />

        {/* Seu conteúdo personalizado aqui */}
      </div>
    )
  }
}

export default AuthenticatedHomeContent
