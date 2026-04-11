import Background from "@rahoot/web/components/Background"
import Loader from "@rahoot/web/components/Loader"
import { useSocket } from "@rahoot/web/features/game/contexts/socket-context"
import { createFileRoute, Outlet } from "@tanstack/react-router"
import { z } from "zod"

const searchSchema = z.object({
  pin: z.string().optional(),
})

const AuthLayout = () => {
  const { isConnected } = useSocket()

  if (!isConnected) {
    return (
      <Background>
        <Loader className="h-23" />
        <h2 className="mt-2 text-center text-2xl font-bold text-white drop-shadow-lg md:text-3xl">
          Loading...
        </h2>
      </Background>
    )
  }

  return (
    <Background>
      <Outlet />
    </Background>
  )
}

export const Route = createFileRoute("/(auth)")({
  component: AuthLayout,
  validateSearch: searchSchema,
})
