import { EXAMPLE_QUIZZ } from "@rahoot/common/constants"
import type {
  GameResult,
  GameResultMeta,
  QuizzWithId,
} from "@rahoot/common/types/game"
import { quizzValidator } from "@rahoot/common/validators/quizz"
import { normalizeFilename } from "@rahoot/socket/utils/game"
import fs from "fs"
import { resolve } from "path"

const inContainerPath = process.env.CONFIG_PATH

const getPath = (path: string = "") =>
  inContainerPath
    ? resolve(inContainerPath, path)
    : resolve(process.cwd(), "../../config", path)

class Config {
  static init() {
    const isConfigFolderExists = fs.existsSync(getPath())

    if (!isConfigFolderExists) {
      fs.mkdirSync(getPath())
    }

    const isGameConfigExists = fs.existsSync(getPath("game.json"))

    if (!isGameConfigExists) {
      fs.writeFileSync(
        getPath("game.json"),
        JSON.stringify(
          {
            managerPassword: "PASSWORD",
          },
          null,
          2,
        ),
      )
    }

    const isQuizzExists = fs.existsSync(getPath("quizz"))

    if (!isQuizzExists) {
      fs.mkdirSync(getPath("quizz"))

      fs.writeFileSync(
        getPath("quizz/example.json"),
        JSON.stringify(EXAMPLE_QUIZZ, null, 2),
      )
    }
  }

  static game() {
    const isExists = fs.existsSync(getPath("game.json"))

    if (!isExists) {
      throw new Error("Game config not found")
    }

    try {
      const config = fs.readFileSync(getPath("game.json"), "utf-8")

      return JSON.parse(config)
    } catch (error) {
      console.error("Failed to read game config:", error)
    }

    return {}
  }

  static quizzMeta() {
    return Config.quizz().map(({ id, subject }) => ({ id, subject }))
  }

  static quizzById(id: string) {
    const filePath = getPath(`quizz/${id}.json`)

    if (!fs.existsSync(filePath)) {
      throw new Error(`Quizz "${id}" not found`)
    }

    const data = fs.readFileSync(filePath, "utf-8")
    const result = quizzValidator.safeParse(JSON.parse(data))

    if (!result.success) {
      throw new Error(`Invalid quizz "${id}"`)
    }

    return { id, ...result.data }
  }

  static quizz() {
    const isExists = fs.existsSync(getPath("quizz"))

    if (!isExists) {
      return []
    }

    try {
      const files = fs
        .readdirSync(getPath("quizz"))
        .filter((file) => file.endsWith(".json"))

      const quizz: QuizzWithId[] = files.flatMap((file) => {
        const data = fs.readFileSync(getPath(`quizz/${file}`), "utf-8")
        const id = file.replace(".json", "")

        const result = quizzValidator.safeParse(JSON.parse(data))

        if (!result.success) {
          console.warn(`Invalid quizz config "${file}":`, result.error.issues)

          return []
        }

        return [{ id, ...result.data }]
      })

      return quizz || []
    } catch (error) {
      console.error("Failed to read quizz config:", error)

      return []
    }
  }

  static updateQuizz(id: string, data: unknown): { id: string } {
    const result = quizzValidator.safeParse(data)

    if (!result.success) {
      throw new Error(result.error.issues[0].message)
    }

    const oldPath = getPath(`quizz/${id}.json`)

    if (!fs.existsSync(oldPath)) {
      throw new Error(`Quizz "${id}" not found`)
    }

    fs.writeFileSync(oldPath, JSON.stringify(result.data, null, 2))

    return { id }
  }

  static deleteQuizz(id: string): void {
    const filePath = getPath(`quizz/${id}.json`)

    if (!fs.existsSync(filePath)) {
      throw new Error(`Quizz "${id}" not found`)
    }

    fs.unlinkSync(filePath)
  }

  static saveResult(data: GameResult): void {
    try {
      const resultsPath = getPath("results")

      if (!fs.existsSync(resultsPath)) {
        fs.mkdirSync(resultsPath)
      }

      fs.writeFileSync(
        getPath(`results/${data.id}.json`),
        JSON.stringify(data, null, 2),
      )

      console.log(`Saved result for "${data.subject}"`)
    } catch (error) {
      console.error("Failed to save result:", error)
    }
  }

  static resultsMeta(): GameResultMeta[] {
    const resultsPath = getPath("results")

    if (!fs.existsSync(resultsPath)) {
      return []
    }

    const readMeta = (file: string): GameResultMeta | null => {
      try {
        const data = fs.readFileSync(getPath(`results/${file}`), "utf-8")
        const result = JSON.parse(data) as GameResult

        return {
          id: result.id,
          subject: result.subject,
          date: result.date,
          playerCount: result.players.length,
        }
      } catch {
        return null
      }
    }

    try {
      return fs
        .readdirSync(resultsPath)
        .filter((file) => file.endsWith(".json"))
        .map(readMeta)
        .filter((meta): meta is GameResultMeta => meta !== null)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    } catch {
      return []
    }
  }

  static resultById(id: string): GameResult {
    const filePath = getPath(`results/${id}.json`)

    if (!fs.existsSync(filePath)) {
      throw new Error(`Result "${id}" not found`)
    }

    return JSON.parse(fs.readFileSync(filePath, "utf-8")) as GameResult
  }

  static deleteResult(id: string): void {
    const filePath = getPath(`results/${id}.json`)

    if (!fs.existsSync(filePath)) {
      throw new Error(`Result "${id}" not found`)
    }

    fs.unlinkSync(filePath)
  }

  static saveQuizz(data: unknown): { id: string } {
    const result = quizzValidator.safeParse(data)

    if (!result.success) {
      throw new Error(result.error.issues[0].message)
    }

    const id = normalizeFilename(result.data.subject)
    const filePath = getPath(`quizz/${id}.json`)

    fs.writeFileSync(filePath, JSON.stringify(result.data, null, 2))

    return { id }
  }
}

export default Config
