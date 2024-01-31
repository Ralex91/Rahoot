import Loader from "@/components/Loader"

export default function Wait({ data: { text } }) {
  return (
    <section className="max-w-7xl mx-auto w-full flex-1 relative items-center justify-center flex flex-col">
      <Loader />
      <h2 className="text-white font-bold text-4xl mt-5 drop-shadow-lg">
        {text}
      </h2>
    </section>
  )
}
