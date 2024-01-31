export default function Leaderboard({ data }) {
  return (
    <section className="max-w-7xl mx-auto w-full flex-1 flex-col relative items-center justify-center flex">
      <h2 className="text-white drop-shadow-md text-5xl font-bold mb-6">
        Leaderboard
      </h2>
      <div className="w-full flex-col flex gap-2">
        <div className=" bg-orange-500 rounded-md p-3 flex justify-between w-full text-white font-bold text-2xl">
          <span>Username</span>
          <span>10000</span>
        </div>

        <div className="bg-orange-500 rounded-md p-3 flex justify-between w-full text-white font-bold text-2xl">
          <span>Username</span>
          <span>10000</span>
        </div>

        <div className="bg-orange-500 rounded-md p-3 flex justify-between w-full text-white font-bold text-2xl">
          <span>Username</span>
          <span>10000</span>
        </div>
      </div>
    </section>
  )
}
