import Image from "next/image"
import { Montserrat } from "next/font/google"
import Form from "@/components/Form"
import Button from "@/components/Button"
import Input from "@/components/Input"
import logo from "@/assets/logo.svg"
import { useState } from "react"
import Loader from "@/components/Loader"
import { usePlayerContext } from "@/context/player"
import Room from "@/components/game/join/Room"
import Username from "@/components/game/join/Username"

export default function Home() {
  const [loading, setLoading] = useState(false)

  const { player } = usePlayerContext()

  return (
    <section className="min-h-screen relative flex justify-center items-center flex-col">
      <div className="absolute w-full h-full overflow-hidden">
        <div className="absolute min-w-[75vmin] min-h-[75vmin] -top-[15vmin] -left-[15vmin] bg-primary/15 rounded-full"></div>
        <div className="absolute min-w-[75vmin] min-h-[75vmin] -bottom-[15vmin] -right-[15vmin] bg-primary/15 rotate-45"></div>
      </div>

      {loading && (
        <div className="absolute w-full h-full z-30 bg-black/40 flex justify-center items-center">
          <Loader />
        </div>
      )}

      <Image src={logo} className="h-10 mb-6" />

      {!player ? <Room /> : <Username />}
    </section>
  )
}
