import { ManagerStatusDataMap } from "@rahoot/common/types/game/status"
import { AnimatePresence, motion } from "motion/react"
import { useEffect, useState } from "react"

type Props = {
  data: ManagerStatusDataMap["SHOW_LEADERBOARD"]
}

const Leaderboard = ({ data: { oldLeaderboard, leaderboard } }: Props) => {
  const [displayedLeaderboard, setDisplayedLeaderboard] =
    useState(oldLeaderboard)

  useEffect(() => {
    setDisplayedLeaderboard(oldLeaderboard)

    const timer = setTimeout(() => {
      setDisplayedLeaderboard(leaderboard)
    }, 2000)

    return () => clearTimeout(timer)
  }, [oldLeaderboard, leaderboard])

  return (
    <section className="relative mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center px-2">
      <h2 className="mb-6 text-5xl font-bold text-white drop-shadow-md">
        Leaderboard
      </h2>
      <div className="flex w-full flex-col gap-2">
        <AnimatePresence mode="popLayout">
          {displayedLeaderboard.map(({ username, points }) => (
            <motion.div
              key={username}
              layout
              initial={{ opacity: 0, y: 50 }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                y: 50,
                transition: { duration: 0.2 },
              }}
              transition={{
                layout: {
                  type: "spring",
                  stiffness: 350,
                  damping: 25,
                },
              }}
              className="bg-primary flex w-full justify-between rounded-md p-3 text-2xl font-bold text-white"
            >
              <span className="drop-shadow-md">{username}</span>
              <span className="drop-shadow-md">{points}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </section>
  )
}

export default Leaderboard
