import Toaster from "@rahoot/web/components/Toaster"
import { SocketProvider } from "@rahoot/web/contexts/socketProvider"
import type { Metadata } from "next"
import { Montserrat } from "next/font/google"
import { PropsWithChildren } from "react"
import "./globals.css"

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Rahoot !",
  icons: "/icon.svg",
}

const RootLayout = ({ children }: PropsWithChildren) => (
  <html lang="en" suppressHydrationWarning={true} data-lt-installed="true">
    <body className={`${montserrat.variable} bg-secondary antialiased`}>
      <SocketProvider>
        <main className="text-base-[8px] flex flex-col">{children}</main>
        <Toaster />
      </SocketProvider>
    </body>
  </html>
)

export default RootLayout
