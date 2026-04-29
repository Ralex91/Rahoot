import Toaster from "@rahoot/web/components/Toaster"
import { socketClient } from "@rahoot/web/features/game/contexts/socket-context"
import "@rahoot/web/i18n"
import "@rahoot/web/index.css"
import { routeTree } from "@rahoot/web/route.gen"
import { RouterProvider, createRouter } from "@tanstack/react-router"
import { StrictMode } from "react"
import { createRoot } from "react-dom/client"

const router = createRouter({ routeTree, context: { socket: socketClient } })

declare module "@tanstack/react-router" {
  // eslint-disable-next-line no-unused-vars
  interface Register {
    router: typeof router
  }
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
    <Toaster />
  </StrictMode>,
)
