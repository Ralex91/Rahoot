export default function Leaderboard({ data: { leaderboard } }) {
  return (
    <section className="max-w-7xl mx-auto w-full flex-1 flex-col relative items-center justify-center flex px-2">
      <h2 className="text-white drop-shadow-md text-5xl font-bold mb-6">
        Leaderboard
      </h2>
      <div className="w-full flex-col flex gap-2">
        {leaderboard.map(({ username, points }) => (
          <div className="bg-primary rounded-md p-3 flex justify-between w-full font-bold text-white text-2xl">
            <span className="drop-shadow-md">{username}</span>
            <span className="drop-shadow-md">{points}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
