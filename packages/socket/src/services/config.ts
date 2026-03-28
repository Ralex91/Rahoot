import type {
  ManagerSettings,
  ManagerSettingsUpdate,
  Quizz,
  QuizzQuestion,
  QuizzWithId,
} from "@mindbuzz/common/types/game"
import fs from "fs"
import { resolve } from "path"

const inContainerPath = process.env.CONFIG_PATH

const getPath = (path: string = "") =>
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

type RawQuizzQuestion = Omit<QuizzQuestion, "solutions"> & {
  solution?: number
  solutions?: number[]
}

type RawQuizz = {
  subject: string
  questions: RawQuizzQuestion[]
}

const normalizeSolutions = (
  question: RawQuizzQuestion,
  answers: string[],
  questionIndex: number,
) => {
  const candidateSolutions = Array.isArray(question.solutions)
    ? question.solutions
    : Number.isInteger(question.solution)
      ? [question.solution]
      : []
  const normalizedSolutions = [...new Set(candidateSolutions)].sort((a, b) => a - b)

  if (normalizedSolutions.length === 0) {
    throw new Error(`Question ${questionIndex + 1} must have at least one correct answer`)
  }

  if (
    normalizedSolutions.some(
      (solution) =>
        !Number.isInteger(solution) || solution < 0 || solution >= answers.length,
    )
  ) {
    throw new Error(`Question ${questionIndex + 1} has an invalid correct answer`)
  }

  return normalizedSolutions
}

const normalizeQuizz = (quizz: RawQuizz): Quizz => {
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

      if (!Number.isInteger(question.cooldown) || question.cooldown < 0) {
        throw new Error(`Question ${index + 1} has an invalid cooldown`)
      }

      if (!Number.isInteger(question.time) || question.time <= 0) {
        throw new Error(`Question ${index + 1} has an invalid answer time`)
      }

      return {
        question: normalizedQuestion,
        answers,
        solutions: normalizeSolutions(question, answers, index),
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
    return getPath("quizz")
  }

  static mediaDirectory() {
    return getMediaPath()
  }

  static init() {
    const isConfigFolderExists = fs.existsSync(getPath())

    if (!isConfigFolderExists) {
      fs.mkdirSync(getPath(), { recursive: true })
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
      fs.mkdirSync(getPath("quizz"), { recursive: true })

      fs.writeFileSync(
        getPath("quizz/example.json"),
        JSON.stringify(
          {
            subject: "Example Quiz",
            questions: [
              {
                question: "What is the correct answer?",
                answers: ["No", "Good answer", "No", "No"],
                solutions: [1],
                cooldown: 5,
                time: 15,
              },
              {
                question: "What is the correct answer with an image?",
                answers: ["No", "No", "No", "Good answer"],
                image: "https://placehold.co/600x400.png",
                solutions: [3],
                cooldown: 5,
                time: 20,
              },
              {
                question: "Which answers are correct?",
                answers: ["Good answer", "No", "Another good answer"],
                image: "https://placehold.co/600x400.png",
                solutions: [0, 2],
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

    if (!fs.existsSync(getMediaPath())) {
      fs.mkdirSync(getMediaPath(), { recursive: true })
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

  static managerSettings(): ManagerSettings {
    const config = Config.game()

    return {
      defaultAudio: normalizeOptionalAsset(config.defaultAudio),
    }
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

      const quizz: QuizzWithId[] = files.map((file) => {
        const data = fs.readFileSync(getPath(`quizz/${file}`), "utf-8")
        const config = normalizeQuizz(JSON.parse(data) as RawQuizz)

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

    while (fs.existsSync(getPath(`quizz/${quizzId}.json`))) {
      duplicateIndex += 1
      quizzId = `${safeBaseId}-${duplicateIndex}`
    }

    const quizz = normalizeQuizz({
      subject: normalizedSubject,
      questions: [
        {
          question: "New question",
          answers: ["Answer 1", "Answer 2"],
          solutions: [0],
          cooldown: 5,
          time: 20,
        },
      ],
    })

    fs.writeFileSync(
      getPath(`quizz/${quizzId}.json`),
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

    const path = getPath(`quizz/${safeId}.json`)

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

    const path = getPath(`quizz/${safeId}.json`)

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

  static updateManagerSettings(settings: ManagerSettingsUpdate) {
    const currentConfig = Config.game()
    const nextConfig = { ...currentConfig }

    if (settings.managerPassword !== undefined) {
      const managerPassword = settings.managerPassword.trim()

      if (!managerPassword) {
        throw new Error("Manager password is required")
      }

      nextConfig.managerPassword = managerPassword
    }

    if (settings.defaultAudio === null) {
      delete nextConfig.defaultAudio
    } else if (settings.defaultAudio !== undefined) {
      const defaultAudio = normalizeOptionalAsset(settings.defaultAudio)

      if (defaultAudio) {
        nextConfig.defaultAudio = defaultAudio
      } else {
        delete nextConfig.defaultAudio
      }
    }

    fs.writeFileSync(getPath("game.json"), JSON.stringify(nextConfig, null, 2))

    return Config.managerSettings()
  }

  static uploadMedia(filename: string, content: string) {
    const normalizedFilename = filename.trim()

    if (!normalizedFilename) {
      throw new Error("Filename is required")
    }

    const safeFilename = normalizedFilename
      .replace(/[^a-zA-Z0-9._-]+/g, "-")
      .replace(/^-+|-+$/g, "")

    if (!safeFilename) {
      throw new Error("Invalid filename")
    }

    const targetPath = getMediaPath(safeFilename)
    const buffer = Buffer.from(content, "base64")

    if (!buffer.length) {
      throw new Error("Uploaded file is empty")
    }

    fs.mkdirSync(getMediaPath(), { recursive: true })
    fs.writeFileSync(targetPath, buffer)

    return `/media/${safeFilename}`
  }
}

export default Config

