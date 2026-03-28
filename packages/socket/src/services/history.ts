import type {
  QuizRunHistoryDetail,
  QuizRunHistorySummary,
} from "@mindbuzz/common/types/game"
import fs from "fs"
import { resolve } from "path"
import { DatabaseSync } from "node:sqlite"

const inContainerPath = process.env.CONFIG_PATH

const getHistoryPath = () =>
  inContainerPath
    ? resolve(inContainerPath, "history.db")
    : resolve(process.cwd(), "../../config", "history.db")

const escapeCsv = (value: string | number | null) => {
  const normalized = value === null ? "" : String(value)

  return `"${normalized.replace(/"/g, '""')}"`
}

class History {
  private static db: DatabaseSync | null = null

  private static getDb() {
    if (History.db) {
      return History.db
    }

    const path = getHistoryPath()
    const directory = resolve(path, "..")

    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory, { recursive: true })
    }

    const db = new DatabaseSync(path)
    db.exec(`
      CREATE TABLE IF NOT EXISTS quiz_runs (
        id TEXT PRIMARY KEY,
        game_id TEXT NOT NULL,
        quizz_id TEXT NOT NULL,
        subject TEXT NOT NULL,
        started_at TEXT NOT NULL,
        ended_at TEXT NOT NULL,
        total_players INTEGER NOT NULL,
        question_count INTEGER NOT NULL,
        winner TEXT,
        payload_json TEXT NOT NULL
      ) STRICT
    `)

    History.db = db

    return db
  }

  static init() {
    History.getDb()
  }

  static addRun(run: QuizRunHistoryDetail) {
    const db = History.getDb()
    const statement = db.prepare(`
      INSERT OR REPLACE INTO quiz_runs (
        id,
        game_id,
        quizz_id,
        subject,
        started_at,
        ended_at,
        total_players,
        question_count,
        winner,
        payload_json
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)

    statement.run(
      run.id,
      run.gameId,
      run.quizzId,
      run.subject,
      run.startedAt,
      run.endedAt,
      run.totalPlayers,
      run.questionCount,
      run.winner,
      JSON.stringify(run),
    )
  }

  static listRuns(): QuizRunHistorySummary[] {
    const db = History.getDb()
    const statement = db.prepare(`
      SELECT
        id,
        game_id AS gameId,
        quizz_id AS quizzId,
        subject,
        started_at AS startedAt,
        ended_at AS endedAt,
        total_players AS totalPlayers,
        question_count AS questionCount,
        winner
      FROM quiz_runs
      ORDER BY ended_at DESC
    `)

    return statement.all() as QuizRunHistorySummary[]
  }

  static getRun(runId: string) {
    const db = History.getDb()
    const statement = db.prepare(`
      SELECT payload_json AS payloadJson
      FROM quiz_runs
      WHERE id = ?
    `)
    const result = statement.get(runId) as { payloadJson: string } | undefined

    if (!result) {
      return null
    }

    return JSON.parse(result.payloadJson) as QuizRunHistoryDetail
  }

  static exportCsv(runId: string) {
    const run = History.getRun(runId)

    if (!run) {
      throw new Error("History entry not found")
    }

    const lines = [
      [
        "Quiz",
        "Started At",
        "Ended At",
        "Question Number",
        "Question",
        "Player",
        "Answer Id",
        "Answer Text",
        "Correct Answer Ids",
        "Correct Answer Texts",
        "Is Correct",
        "Points Earned",
        "Total Points",
        "Final Rank",
      ]
        .map(escapeCsv)
        .join(","),
    ]

    run.questions.forEach((question) => {
      question.responses.forEach((response) => {
        const leaderboardEntry = run.leaderboard.find(
          (entry) => entry.playerId === response.playerId,
        )

        lines.push(
          [
            run.subject,
            run.startedAt,
            run.endedAt,
            question.questionNumber,
            question.question,
            response.username,
            response.answerId,
            response.answerText,
            question.correctAnswers.join("; "),
            question.correctAnswerTexts.join(" | "),
            response.isCorrect ? "yes" : "no",
            response.points,
            response.totalPoints,
            leaderboardEntry?.rank ?? "",
          ]
            .map(escapeCsv)
            .join(","),
        )
      })
    })

    const safeSubject = run.subject.toLowerCase().replace(/[^a-z0-9]+/g, "-")

    return {
      filename: `${safeSubject || "quiz"}-${run.id}.csv`,
      content: lines.join("\n"),
    }
  }
}

export default History

