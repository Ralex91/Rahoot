import AuthLayout from "@mindbuzz/web/pages/game/auth/layout"
import PlayerAuthPage from "@mindbuzz/web/pages/game/auth/page"
import { GameLayout } from "@mindbuzz/web/pages/game/layout"
import { createBrowserRouter, RouterProvider } from "react-router"
import AuthManagerPage from "./pages/game/auth/manager/page"
import ManagerGamePage from "./pages/game/party/manager/page"
import PlayerGamePage from "./pages/game/party/page"

const router = createBrowserRouter([
  {
    path: "/",
    element: <GameLayout />,
    children: [
      {
        path: "/",
        element: <AuthLayout />,
        children: [
          {
            path: "/",
            element: <PlayerAuthPage />,
          },
          {
            path: "/manager",
            element: <AuthManagerPage />,
          },
        ],
      },
      {
        path: "/party/:gameId",
        element: <PlayerGamePage />,
      },
      {
        path: "/party/manager/:gameId",
        element: <ManagerGamePage />,
      },
    ],
  },
])

const Router = () => <RouterProvider router={router} />

export default Router

