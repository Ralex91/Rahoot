"use client"

import logo from "@rahoot/web/assets/logo.svg"
import Image from "next/image"
import { PropsWithChildren } from "react"

const JoinLayout = ({ children }: PropsWithChildren) => {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center">
      <div className="absolute h-full w-full overflow-hidden">
        <div className="bg-primary/15 absolute -top-[15vmin] -left-[15vmin] min-h-[75vmin] min-w-[75vmin] rounded-full"></div>
        <div className="bg-primary/15 absolute -right-[15vmin] -bottom-[15vmin] min-h-[75vmin] min-w-[75vmin] rotate-45"></div>
      </div>

      <Image src={logo} className="mb-6 h-32" alt="logo" />
      {children}
    </section>
  )
}

export default JoinLayout
