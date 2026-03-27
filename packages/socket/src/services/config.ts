import type {
  ManagerSettings,
  ManagerSettingsUpdate,
  Quizz,
  QuizzWithId,
} from "@rahoot/common/types/game"
import fs from "fs"
import { basename, extname, resolve } from "path"

const inContainerPath = process.env.CONFIG_PATH

type GameConfig = {
  managerPassword: string
  defaultAudio?: string
}

const getConfigPath = (path: string = "") =>
  inContainerPath
    ? resolve(inContainerPath, path)
    : resolve(process.cwd(), "../../config", path)

const getMediaPath = (path: string = "") =>
  inContainerPath
    ? resolve(inContainerPath, "..", "media", path)
    : resolve(process.cwd(), "../../media", path)

const normalizeOptionalAsset = (value?: string) => {
  const trimmed = value?.trim()

  return trimmed ? trimmed : undefined
}

const normalizeManagerPassword = (value: unknown) =>
  typeof value === "string" && value.trim() ? value.trim() : "PASSWORD"

const normalizeGameConfig = (config: Partial<GameConfig>): GameConfig => ({
  managerPassword: normalizeManagerPassword(config.managerPassword),
  defaultAudio: normalizeOptionalAsset(config.defaultAudio),
})

const normalizeQuizz = (quizz: Quizz): Quizz => {
  const subject = quizz.subject.trim()

  if (!subject) {
    throw new Error("Quiz subject is required")
  }

  if (!Array.isArray(quizz.questions) || quizz.questions.length === 0) {
    throw new Error("Quiz must contain at least one question")
  }

  return {
    subject,
    questions: quizz.questions.map((question, index) => {
      const normalizedQuestion = question.question.trim()
      const answers = question.answers.map((answer) => answer.trim())

      if (!normalizedQuestion) {
        throw new Error(`Question ${index + 1} must have text`)
      }

      if (answers.length < 2 || answers.length > 4) {
        throw new Error(`Question ${index + 1} must have between 2 and 4 answers`)
      }

      if (answers.some((answer) => !answer)) {
        throw new Error(`Question ${index + 1} contains an empty answer`)
      }

      if (
        !Number.isInteger(question.solution) ||
        question.solution < 0 ||
        question.solution >= answers.length
      ) {
        throw new Error(`Question ${index + 1} has an invalid correct answer`)
      }

      if (!Number.isInteger(question.cooldown) || question.cooldown < 0) {
        throw new Error(`Question ${index + 1} has an invalid cooldown`)
      }

      if (!Number.isInteger(question.time) || question.time <= 0) {
        throw new Error(`Question ${index + 1} has an invalid answer time`)
      }

      return {
        question: normalizedQuestion,
        answers,
        solution: question.solution,
        cooldown: question.cooldown,
        time: question.time,
        image: normalizeOptionalAsset(question.image),
        video: normalizeOptionalAsset(question.video),
        audio: normalizeOptionalAsset(question.audio),
      }
    }),
  }
}

class Config {
  static quizzDirectory() {
    return getConfigPath("quizz")
  }

  static mediaDirectory() {
    return getMediaPath()
  }

  static init() {
    const isConfigFolderExists = fs.existsSync(getConfigPath())

    if (!isConfigFolderExists) {
      fs.mkdirSync(getConfigPath(), { recursive: true })
    }

    const isMediaFolderExists = fs.existsSync(getMediaPath())

    if (!isMediaFolderExists) {
      fs.mkdirSync(getMediaPath(), { recursive: true })
    }

    const isGameConfigExists = fs.existsSync(getConfigPath("game.json"))

    if (!isGameConfigExists) {
      fs.writeFileSync(
        getConfigPath("game.json"),
        JSON.stringify(
          {
            managerPassword: "PASSWORD",
          },
          null,
          2,
        ),
      )
    }

    const isQuizzExists = fs.existsSync(getConfigPath("quizz"))

    if (!isQuizzExists) {
      fs.mkdirSync(getConfigPath("quizz"))

      fs.writeFileSync(
        getConfigPath("quizz/example.json"),
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
          2,
        ),
      )
    }
  }

  static game() {
    const isExists = fs.existsSync(getConfigPath("game.json"))

    if (!isExists) {
      throw new Error("Game config not found")
    }

    try {
      const config = fs.readFileSync(getConfigPath("game.json"), "utf-8")

      return normalizeGameConfig(JSON.parse(config) as Partial<GameConfig>)
    } catch (error) {
      console.error("Failed to read game config:", error)
    }

    return normalizeGameConfig({})
  }

  static managerSettings(): ManagerSettings {
    const { defaultAudio } = Config.game()

    return {
      defaultAudio,
    }
  }

  static quizz() {
    const isExists = fs.existsSync(getConfigPath("quizz"))

    if (!isExists) {
      return []
    }

    try {
      const files = fs
        .readdirSync(getConfigPath("quizz"))
        .filter((file) => file.endsWith(".json"))

      const quizz: QuizzWithId[] = files.map((file) => {
        const data = fs.readFileSync(getConfigPath(`quizz/${file}`), "utf-8")
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

  static createQuizz(subject: string) {
    const normalizedSubject = subject.trim()

    if (!normalizedSubject) {
      throw new Error("Quiz subject is required")
    }

    const baseId = normalizedSubject
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")

    const safeBaseId = baseId || "quiz"
    let quizzId = safeBaseId
    let duplicateIndex = 1

    while (fs.existsSync(getConfigPath(`quizz/${quizzId}.json`))) {
      duplicateIndex += 1
      quizzId = `${safeBaseId}-${duplicateIndex}`
    }

    const quizz = normalizeQuizz({
      subject: normalizedSubject,
      questions: [
        {
          question: "New question",
          answers: ["Answer 1", "Answer 2"],
          solution: 0,
          cooldown: 5,
          time: 20,
        },
      ],
    })

    fs.writeFileSync(
      getConfigPath(`quizz/${quizzId}.json`),
      JSON.stringify(quizz, null, 2),
    )

    return {
      id: quizzId,
      ...quizz,
    }
  }

  static deleteQuizz(quizzId: string) {
    const normalizedId = quizzId.trim()

    if (!normalizedId) {
      throw new Error("Quiz id is required")
    }

    const safeId = normalizedId.replace(/[^a-zA-Z0-9-_]/g, "")

    if (!safeId || safeId !== normalizedId) {
      throw new Error("Invalid quiz id")
    }

    const path = getConfigPath(`quizz/${safeId}.json`)

    if (!fs.existsSync(path)) {
      throw new Error("Quiz not found")
    }

    fs.unlinkSync(path)
  }

  static updateQuizz(quizzId: string, quizz: Quizz) {
    const normalizedId = quizzId.trim()

    if (!normalizedId) {
      throw new Error("Quiz id is required")
    }

    const safeId = normalizedId.replace(/[^a-zA-Z0-9-_]/g, "")

    if (!safeId || safeId !== normalizedId) {
      throw new Error("Invalid quiz id")
    }

    const path = getConfigPath(`quizz/${safeId}.json`)

    if (!fs.existsSync(path)) {
      throw new Error("Quiz not found")
    }

    const normalizedQuizz = normalizeQuizz(quizz)

    fs.writeFileSync(path, JSON.stringify(normalizedQuizz, null, 2))

    return {
      id: safeId,
      ...normalizedQuizz,
    }
  }

  static updateSettings(settings: ManagerSettingsUpdate) {
    const currentConfig = Config.game()
    const nextPassword =
      settings.managerPassword === undefined
        ? currentConfig.managerPassword
        : settings.managerPassword.trim()

    if (!nextPassword) {
      throw new Error("Manager password is required")
    }

    const defaultAudio =
      settings.defaultAudio === undefined
        ? currentConfig.defaultAudio
        : settings.defaultAudio === null
          ? undefined
          : normalizeOptionalAsset(settings.defaultAudio)

    const nextConfig: GameConfig = {
      managerPassword: nextPassword,
      defaultAudio,
    }

    fs.writeFileSync(
      getConfigPath("game.json"),
      JSON.stringify(nextConfig, null, 2),
    )

    return Config.managerSettings()
  }

  static uploadMedia(filename: string, content: string) {
    const normalizedFilename = basename(filename).trim()

    if (!normalizedFilename) {
      throw new Error("Filename is required")
    }

    const safeBaseName = normalizedFilename
      .replace(extname(normalizedFilename), "")
      .replace(/[^a-zA-Z0-9-_]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-+|-+$/g, "")

    const extension = extname(normalizedFilename)
      .toLowerCase()
      .replace(/[^a-z0-9.]/g, "")
    const safeFilename = `${safeBaseName || "audio"}-${Date.now()}${extension}`
    const outputPath = getMediaPath(safeFilename)
    const fileContent = Buffer.from(content, "base64")

    if (fileContent.length === 0) {
      throw new Error("Uploaded file is empty")
    }

    fs.mkdirSync(getMediaPath(), { recursive: true })
    fs.writeFileSync(outputPath, fileContent)

    return {
      filename: safeFilename,
      url: `/media/${encodeURIComponent(safeFilename)}`,
    }
  }

  static resolveMediaFile(filename: string) {
    const decodedFilename = decodeURIComponent(filename).trim()

    if (!decodedFilename || decodedFilename !== basename(decodedFilename)) {
      return null
    }

    const safeFilename = decodedFilename.replace(/[^a-zA-Z0-9._-]/g, "")

    if (!safeFilename) {
      return null
    }

    return getMediaPath(safeFilename)
  }
}

export default Config
