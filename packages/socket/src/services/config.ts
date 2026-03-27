import type { Quizz, QuizzWithId } from "@rahoot/common/types/game"
import fs from "fs"
import { resolve } from "path"

const inContainerPath = process.env.CONFIG_PATH

const getPath = (path: string = "") =>
  inContainerPath
    ? resolve(inContainerPath, path)
    : resolve(process.cwd(), "../../config", path)

const normalizeOptionalAsset = (value?: string) => {
  const trimmed = value?.trim()

  return trimmed ? trimmed : undefined
}

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
    return getPath("quizz")
  }

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
          solution: 0,
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
}

export default Config
