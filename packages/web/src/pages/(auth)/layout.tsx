import Background from "@rahoot/web/components/Background"
import LanguageSwitcher from "@rahoot/web/components/LanguageSwitcher"
import Loader from "@rahoot/web/components/Loader"
import { useSocket } from "@rahoot/web/features/game/contexts/socket-context"
import { createFileRoute, Outlet } from "@tanstack/react-router"
import { useTranslation } from "react-i18next"
import { z } from "zod"

const searchSchema = z.object({
  pin: z.coerce.string().optional(),
})

const AuthLayout = () => {
  const { isConnected } = useSocket()
  const { t } = useTranslation()

  if (!isConnected) {
    return (
      <Background>
        <Loader className="h-23" />
        <h2 className="mt-2 text-center text-2xl font-bold text-white drop-shadow-lg md:text-3xl">
          {t("common:loading")}
        </h2>
      </Background>
    )
  }

  return (
    <Background>
      <div className="absolute top-4 right-4">
        <LanguageSwitcher />
      </div>
      <Outlet />
    </Background>
  )
}

export const Route = createFileRoute("/(auth)")({
  component: AuthLayout,
  validateSearch: searchSchema,
})
