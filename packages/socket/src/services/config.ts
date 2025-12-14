import { QuizzWithId } from "@rahoot/common/types/game"
import fs from "fs"
import { resolve } from "path"

const inContainerPath = process.env.CONFIG_PATH

const getPath = (path: string = "") =>
  inContainerPath
    ? resolve(inContainerPath, path)
    : resolve(process.cwd(), "../../quizz", path)

type GameConfig = {
  managerPassword: string
  music: boolean
}

class Config {
  static init() {
    const isQuizzFolderExists = fs.existsSync(getPath())

    if (!isQuizzFolderExists) {
      fs.mkdirSync(getPath())

      fs.writeFileSync(
        getPath("example.json"),
        JSON.stringify(
          {
            subject: "Example Quizz",
            questions: [
              {
                question: "What is good answer ?",
                answers: ["No", "Good answer", "No", "No"],
                solution: 1,
                cooldown: 5,
                time: 15,
              },
              {
                question: "What is good answer with image ?",
                answers: ["No", "No", "No", "Good answer"],
                image: "https://placehold.co/600x400.png",
                solution: 3,
                cooldown: 5,
                time: 20,
              },
              {
                question: "What is good answer with two answers ?",
                answers: ["Good answer", "No"],
                image: "https://placehold.co/600x400.png",
                solution: 0,
                cooldown: 5,
                time: 20,
              },
            ],
          },
          null,
          2
        )
      )
    }
  }

  static game(): GameConfig {
    const managerPassword = process.env.MANAGER_PASSWORD ?? "PASSWORD"
    const musicEnv = process.env.MUSIC_ENABLED ?? "true"
    const music = musicEnv.toLowerCase() === "true"

    return {
      managerPassword,
      music,
    }
  }
  static quizz() {
    const isExists = fs.existsSync(getPath())

    if (!isExists) {
      return []
    }

    try {
      const files = fs
        .readdirSync(getPath())
        .filter((file) => file.endsWith(".json"))

      const quizz: QuizzWithId[] = files.map((file) => {
        const data = fs.readFileSync(getPath(`${file}`), "utf-8")
        const config = JSON.parse(data)

        const id = file.replace(".json", "")

        return {
          id,
          ...config,
        }
      })

      return quizz || []
    } catch (error) {
      console.error("Failed to read quizz config:", error)

      return []
    }
  }
}

export default Config
