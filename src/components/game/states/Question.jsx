import { useRef } from "react"

export default function Question({ data: { question } }) {
  const barRef = useRef(null)

  return (
    <section className="relative mx-auto flex h-full w-full max-w-7xl flex-1 flex-col items-center px-4">
      <div className="flex flex-1 items-center">
        <h2 className="anim-show text-center text-3xl font-bold text-white drop-shadow-lg md:text-4xl lg:text-5xl">
          {question}
        </h2>
      </div>
      <div
        ref={barRef}
        className="mb-20 h-4 self-start justify-self-end rounded-full bg-primary"
        style={{ animation: `progressBar ${6}s linear forwards` }}
      ></div>
    </section>
  )
}
