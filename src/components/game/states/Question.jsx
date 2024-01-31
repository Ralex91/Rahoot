import { useSocketContext } from "@/context/socket"
import { useEffect, useRef } from "react"

export default function Question({ data: { question } }) {
  const barRef = useRef(null)

  useEffect(() => {
    setTimeout(() => {
      barRef.current.style.width = "100%"
    }, 1)
  }, [])

  return (
    <section className="max-w-7xl mx-auto w-full flex-1 relative items-center flex flex-col px-4 h-full">
      <div className="flex items-center flex-1">
        <h2 className="text-white text-5xl font-bold drop-shadow-lg text-center anim-show w-full justify-self-center">
          {question}
        </h2>
      </div>
      <div
        ref={barRef}
        className="h-6 bg-primary mb-32 rounded-full self-start justify-self-end"
        style={{ transition: `width ${6}s linear`, width: "0%" }}
      ></div>
    </section>
  )
}
