import Image from "next/image"
import Form from "@/components/Form"
import Button from "@/components/Button"
import Input from "@/components/Input"
import logo from "@/assets/logo.svg"
import { useEffect, useRef, useState } from "react"
import Loader from "@/components/Loader"
import { useSocketContext } from "@/context/socket"
import background from "@/assets/2238431_1694.jpg"

export default function Questionasas() {
  const [loading, setLoading] = useState(false)

  const socket = useSocketContext()
  const barRef = useRef(null)

  useEffect(() => {
    setTimeout(() => {
      barRef.current.style.width = "100%"
    })
  }, [])

  return (
    <section className="min-h-screen relative flex justify-center items-center flex-col max-w-7xl mx-auto">
      <div className="fixed h-full w-full top-0 left-0 bg-orange-600 opacity-70 -z-10">
        <Image
          className="object-cover h-full w-full opacity-60 pointer-events-none"
          src={background}
        />
      </div>

      <h2 className="text-white text-5xl font-bold drop-shadow-lg text-center">
        Lorem ipsum dolor sit ametorrupti. Alias, recusandae officia.
      </h2>

      <div
        ref={barRef}
        className="absolute h-6 bg-primary bottom-0 mb-32 rounded-full w-0 self-start"
        style={{ transition: "width 5s linear" }}
      ></div>
    </section>
  )
}
