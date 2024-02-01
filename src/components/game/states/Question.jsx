import { useSocketContext } from "@/context/socket"
import { useEffect, useRef } from "react"

export default function Question({ data: { question } }) {
  const barRef = useRef(null)

  return (
    <section className="max-w-7xl mx-auto w-full flex-1 relative items-center flex flex-col px-4 h-full">
      <div className="flex items-center flex-1">
        <h2 className="text-white text-2xl md:text-4xl lg:text-5xl anim-show font-bold drop-shadow-lg text-center">
          {question}
        </h2>
      </div>
      <div
        ref={barRef}
        className="h-4 bg-primary mb-20 rounded-full self-start justify-self-end"
        style={{ animation: `progressBar ${6}s linear forwards` }}
      ></div>
    </section>
  )
}
