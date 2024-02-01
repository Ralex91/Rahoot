import Loader from "@/components/Loader"

export default function Wait({ data: { text } }) {
  return (
    <section className="relative mx-auto flex w-full max-w-7xl flex-1 flex-col items-center justify-center">
      <Loader />
      <h2 className="mt-5 text-4xl font-bold text-white drop-shadow-lg">
        {text}
      </h2>
    </section>
  )
}
