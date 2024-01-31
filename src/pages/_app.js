import { PlayerContextProvider } from "@/context/player"
import { SocketContextProvider } from "@/context/socket"
import "@/styles/globals.css"
import clsx from "clsx"
import { Montserrat, Plaster } from "next/font/google"

const montserrat = Montserrat({ subsets: ["latin"] })

export default function App({ Component, pageProps }) {
  return (
    <SocketContextProvider>
      <PlayerContextProvider>
        <main
          className={clsx(
            "flex flex-col text-base-[8px]",
            montserrat.className
          )}
        >
          <Component {...pageProps} />
        </main>
      </PlayerContextProvider>
    </SocketContextProvider>
  )
}
